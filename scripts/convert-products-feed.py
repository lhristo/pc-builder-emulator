#!/usr/bin/env python3
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


COLORS = {
    "case": "#ced4da",
    "motherboard": "#264653",
    "cpu": "#f4a261",
    "ram": "#95d5b2",
    "gpu": "#76e4c5",
    "storage": "#e0fbfc",
    "psu": "#e9ecef",
    "cooler": "#8ecae6",
}


def text(elem, tag, default=""):
    return (elem.findtext(tag) or default).strip()


def number(value, default=None):
    match = re.search(r"\d+(?:[.,]\d+)?", str(value or ""))
    if not match:
        return default
    return float(match.group(0).replace(",", "."))


def integer(value, default=None):
    value = number(value, default)
    return int(value) if value is not None else default


def properties(elem):
    props = {}
    props_el = elem.find("properties")
    if props_el is None:
        return props
    for prop in props_el.findall("property"):
        name = (prop.attrib.get("name") or "").strip()
        if name:
            props[name.lower()] = (prop.text or "").strip()
    return props


def prop(props, *names):
    for name in names:
        value = props.get(name.lower())
        if value:
            return value
    return ""


def image(elem):
    gallery = elem.find("gallery")
    if gallery is None:
        return ""
    return (gallery.findtext("pictureUrl") or "").strip()


def chipset(value):
    match = re.search(r"\b(X870E|X870|X670E|X670|B850|B840|B650E|B650|A620|Z890|B860|H810|Z790|B760|B660|H610|B550|B450|X570|H510)\b", value, re.I)
    return match.group(1).upper() if match else ""


def socket(category, subcategory, props, haystack):
    explicit = prop(props, "socket", "cpu socket support")
    source = " ".join([subcategory, explicit, haystack]).upper()
    if "LGA1851" in source or "1851" in source:
        return "LGA1851"
    if "LGA1700" in source or "1700" in source:
        return "LGA1700"
    if "LGA1200" in source or "1200" in source:
        return "LGA1200"
    if "AM5" in source:
        return "AM5"
    if "AM4" in source:
        return "AM4"
    return ""


def ram_type(subcategory, props, haystack):
    source = " ".join([subcategory, prop(props, "type", "memory specification"), haystack]).upper()
    if "DDR5" in source or "D5" in source:
        return "DDR5"
    if "DDR4" in source:
        return "DDR4"
    if "DDR3" in source:
        return "DDR3"
    return ""


def form_factor(props, haystack):
    source = " ".join([prop(props, "form factor", "specifications"), haystack]).upper()
    if "MINI-ITX" in source or "MINI ITX" in source or "ITX" in source:
        return "Mini-ITX"
    if "MICRO ATX" in source or "MICRO-ATX" in source or "MATX" in source or re.search(r"\bM\b", haystack.upper()):
        return "mATX"
    return "ATX"


def capacity_gb(value):
    source = str(value or "").upper().replace(" ", "")
    match = re.search(r"(\d+(?:\.\d+)?)(TB|T|GB|G)", source)
    if not match:
        return None
    amount = float(match.group(1))
    unit = match.group(2)
    if unit in {"TB", "T"}:
        amount *= 1024
    return int(amount)


def first_dimension_mm(value):
    dims = [float(item) for item in re.findall(r"\d+(?:\.\d+)?", str(value or ""))]
    return int(max(dims)) if dims else None


def product_base(elem, mapped_category, props):
    xml_id = elem.attrib.get("id", "")
    price = number(text(elem, "price"), 0)
    currency = text(elem, "currency", "USD") or "USD"
    category = text(elem, "category")
    subcategory = text(elem, "subcategory")
    manufacturer = text(elem, "manufacturer")
    part_number = text(elem, "PartNumber")
    return {
        "id": f"feed-{xml_id}",
        "category": mapped_category,
        "name": text(elem, "name"),
        "price": price,
        "specs": {
            "manufacturer": manufacturer,
            "currency": currency,
            "sourceCategory": category,
            "sourceSubcategory": subcategory,
            "partNumber": part_number,
            "image": image(elem),
            "color": COLORS[mapped_category],
        },
    }


def map_cpu(elem, subcategory, props, haystack):
    part = product_base(elem, "cpu", props)
    specs = part["specs"]
    specs.update(
        {
            "socket": socket("CPU", subcategory, props, haystack),
            "cores": integer(prop(props, "number of cores"), integer(re.search(r"(\d+)CORES", haystack.upper()).group(1) if re.search(r"(\d+)CORES", haystack.upper()) else None, 4)),
            "boost": prop(props, "frequency") or "",
        }
    )
    part["wattage"] = integer(prop(props, "tdp"), integer(re.search(r"(\d+)W", haystack.upper()).group(1) if re.search(r"(\d+)W", haystack.upper()) else None, 65))
    return part if specs["socket"] else None


def map_motherboard(elem, subcategory, props, haystack):
    part = product_base(elem, "motherboard", props)
    specs = part["specs"]
    board_socket = socket("MAIN BOARD", subcategory, props, haystack)
    if not board_socket:
        return None
    source = " ".join([haystack, prop(props, "memory", "memory specification", "specifications")])
    specs.update(
        {
            "socket": board_socket,
            "ramType": ram_type(subcategory, props, source) or ("DDR5" if board_socket in {"AM5", "LGA1851"} else "DDR4"),
            "formFactor": form_factor(props, haystack),
            "m2": max(1, len(re.findall(r"M\.2|M2", source, re.I))),
            "sata": integer(re.search(r"(\d+)\s*x?\s*SATA", source, re.I).group(1) if re.search(r"(\d+)\s*x?\s*SATA", source, re.I) else None, 4),
            "chipset": chipset(haystack),
        }
    )
    return part


def map_ram(elem, subcategory, props, haystack):
    if "NOTEBOOK" in subcategory.upper() or "SODIMM" in haystack.upper():
        return None
    part = product_base(elem, "ram", props)
    specs = part["specs"]
    capacity = prop(props, "capacity") or haystack
    speed = prop(props, "speed") or haystack
    specs.update(
        {
            "ramType": ram_type(subcategory, props, haystack),
            "capacity": f"{capacity_gb(capacity) or 0} GB",
            "speed": f"{integer(speed, 0)} MT/s" if integer(speed, 0) else "",
            "modules": 2 if re.search(r"\b(2X|KIT|DUAL)\b", haystack, re.I) else 1,
        }
    )
    part["wattage"] = 4 * specs["modules"]
    return part if specs["ramType"] and capacity_gb(capacity) else None


def map_gpu(elem, subcategory, props, haystack):
    part = product_base(elem, "gpu", props)
    specs = part["specs"]
    dimensions = prop(props, "dimensions")
    power = integer(prop(props, "power consumption"), integer(re.search(r"POWER\s+CONSUMPTION\s*:?\s*(\d+)", haystack, re.I).group(1) if re.search(r"POWER\s+CONSUMPTION\s*:?\s*(\d+)", haystack, re.I) else None, 160))
    mem = prop(props, "memmory size", "memory size") or (re.search(r"(\d+\s*GB)", haystack, re.I).group(1) if re.search(r"(\d+\s*GB)", haystack, re.I) else "")
    slot_match = re.search(r"([\d.]+)\s*slot", prop(props, "i/o") + " " + haystack, re.I)
    specs.update(
        {
            "length": first_dimension_mm(dimensions) or 260,
            "memory": mem,
            "slots": float(slot_match.group(1)) if slot_match else 2,
        }
    )
    part["wattage"] = power
    return part


def map_storage(elem, subcategory, props, haystack):
    category_text = " ".join([subcategory, haystack, prop(props, "form factor", "interface")]).upper()
    internal = any(token in subcategory.upper() for token in ["SSD", "INTERNAL"]) and "EXTERNAL" not in subcategory.upper()
    if not internal:
        return None
    part = product_base(elem, "storage", props)
    specs = part["specs"]
    cap = capacity_gb(prop(props, "capacity") or haystack)
    interface = "M.2" if "M.2" in category_text or "M2" in category_text else "SATA"
    perf = prop(props, "performance")
    read = integer(re.search(r"READ:?[\s~]*(\d+)", perf, re.I).group(1) if re.search(r"READ:?[\s~]*(\d+)", perf, re.I) else None, 560 if interface == "SATA" else 3500)
    specs.update({"interface": interface, "capacity": f"{cap or 0} GB", "speed": f"{read} MB/s"})
    part["wattage"] = 8 if interface == "M.2" else 6
    return part if cap else None


def map_psu(elem, subcategory, props, haystack):
    name = text(elem, "name").upper()
    is_psu_subcategory = subcategory.upper().strip() == "PSU"
    is_psu_name = name.startswith("PSU ") or name.startswith("POWER SUPPLY ")
    if not (is_psu_subcategory or is_psu_name):
        return None
    part = product_base(elem, "psu", props)
    specs = part["specs"]
    watts = integer(haystack, integer(prop(props, "dc output"), 650))
    source = " ".join([haystack, prop(props, "connectors", "features")]).upper()
    rating = "80+ Platinum" if "PLATINUM" in source else "80+ Gold" if "GOLD" in source else "80+ Bronze" if "BRONZE" in source else "80+"
    specs.update({"watts": watts, "rating": rating, "connector": "12V-2x6" if "PCIE5" in source or "12V-2X6" in source or watts >= 850 else "PCIe 8-pin"})
    return part if watts else None


def map_case(elem, subcategory, props, haystack):
    if "CASE" not in subcategory.upper():
        return None
    part = product_base(elem, "case", props)
    specs = part["specs"]
    spec_text = prop(props, "specifications")
    cooling = prop(props, "cooling")
    max_gpu = integer(re.search(r"GRAPHICS CARD LENGTH:?\s*(\d+)", spec_text, re.I).group(1) if re.search(r"GRAPHICS CARD LENGTH:?\s*(\d+)", spec_text, re.I) else None, 320)
    radiator = max([integer(value, 0) for value in re.findall(r"(120|240|280|360|420)\s*mm\s*Radiator", cooling, re.I)] or [120])
    specs.update({"formFactor": form_factor(props, spec_text + " " + haystack), "maxGpu": max_gpu, "radiator": radiator})
    return part


def map_cooler(elem, subcategory, props, haystack):
    if subcategory.upper() not in {"CPU COOLER", "WATER COOLER"}:
        return None
    part = product_base(elem, "cooler", props)
    specs = part["specs"]
    support = prop(props, "cpu socket support")
    sockets = [item for item in ["AM5", "AM4", "LGA1851", "LGA1700", "LGA1200"] if item in support.upper().replace(" ", "")]
    is_liquid = "WATER" in subcategory.upper() or "LIQUID" in haystack.upper()
    radiator = integer(re.search(r"(120|240|280|360|420)", haystack + " " + prop(props, "other"), re.I).group(1) if re.search(r"(120|240|280|360|420)", haystack + " " + prop(props, "other"), re.I) else None, 240 if is_liquid else 0)
    capacity = integer(re.search(r"UP TO\s*(\d+)W", support.upper()).group(1) if re.search(r"UP TO\s*(\d+)W", support.upper()) else None, 300 if radiator >= 360 else 220 if is_liquid else 180)
    specs.update({"socket": "Universal", "radiator": radiator, "style": "Liquid" if is_liquid else "Air", "supportedSockets": sockets or ["AM5", "AM4", "LGA1851", "LGA1700", "LGA1200"], "coolingCapacity": capacity})
    part["wattage"] = 10 if is_liquid else 5
    return part


MAPPERS = {
    "CPU": map_cpu,
    "MAIN BOARD": map_motherboard,
    "RAM": map_ram,
    "VIDEO CARD": map_gpu,
    "HDD": map_storage,
    "CASE": None,
    "FAN": None,
}


def convert(path):
    parts = []
    for _, elem in ET.iterparse(path, events=("end",)):
        if elem.tag != "product":
            continue
        category = text(elem, "category")
        subcategory = text(elem, "subcategory")
        props = properties(elem)
        haystack = " ".join([text(elem, "name"), text(elem, "searchstring"), subcategory, " ".join(props.values())])
        mapper = MAPPERS.get(category)
        part = None
        if category == "CASE":
            part = map_case(elem, subcategory, props, haystack) or map_psu(elem, subcategory, props, haystack)
        elif category == "FAN":
            part = map_cooler(elem, subcategory, props, haystack)
        elif mapper:
            part = mapper(elem, subcategory, props, haystack)
        if part and part["name"] and part["price"]:
            parts.append(part)
        elem.clear()
    return parts


def main():
    if len(sys.argv) != 3:
        raise SystemExit("Usage: convert-products-feed.py input.xml output.js")
    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    parts = convert(input_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        "export const feedComponents = "
        + json.dumps(parts, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(parts)} components to {output_path}")


if __name__ == "__main__":
    main()
