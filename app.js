import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const categories = [
  { id: "case", label: "Case" },
  { id: "motherboard", label: "Motherboard" },
  { id: "cpu", label: "Processor" },
  { id: "ram", label: "RAM" },
  { id: "gpu", label: "Graphics" },
  { id: "storage", label: "Storage" },
  { id: "psu", label: "Power" },
  { id: "cooler", label: "Cooling" }
];

const components = [
  {
    id: "case-atx-air",
    category: "case",
    name: "Northline Air ATX",
    price: 129,
    specs: { formFactor: "ATX", maxGpu: 360, radiator: 240, color: "#d8e0e8" }
  },
  {
    id: "case-matx-glass",
    category: "case",
    name: "CubeView mATX Glass",
    price: 92,
    specs: { formFactor: "mATX", maxGpu: 285, radiator: 120, color: "#a2d2ff" }
  },
  {
    id: "mb-b650",
    category: "motherboard",
    name: "Auron B650 Pro",
    price: 189,
    specs: { socket: "AM5", ramType: "DDR5", formFactor: "ATX", m2: 3, sata: 4, color: "#244c78" }
  },
  {
    id: "mb-b760",
    category: "motherboard",
    name: "Vector B760M",
    price: 149,
    specs: { socket: "LGA1700", ramType: "DDR4", formFactor: "mATX", m2: 2, sata: 4, color: "#31594a" }
  },
  {
    id: "cpu-ryzen",
    category: "cpu",
    name: "Ryzen 7 8700X",
    price: 329,
    wattage: 105,
    specs: { socket: "AM5", cores: 8, boost: "5.1 GHz", color: "#f2a65a" }
  },
  {
    id: "cpu-core",
    category: "cpu",
    name: "Core i5 14600",
    price: 285,
    wattage: 125,
    specs: { socket: "LGA1700", cores: 14, boost: "5.2 GHz", color: "#7cb7ff" }
  },
  {
    id: "ram-ddr5-32",
    category: "ram",
    name: "32 GB DDR5 RGB Kit",
    price: 118,
    wattage: 10,
    specs: { ramType: "DDR5", capacity: "32 GB", speed: "6000 MT/s", color: "#9dffb0" }
  },
  {
    id: "ram-ddr4-16",
    category: "ram",
    name: "16 GB DDR4 Low Profile",
    price: 52,
    wattage: 7,
    specs: { ramType: "DDR4", capacity: "16 GB", speed: "3600 MT/s", color: "#ffd166" }
  },
  {
    id: "gpu-4070",
    category: "gpu",
    name: "GeForce RTX 4070 Aero",
    price: 579,
    wattage: 200,
    specs: { length: 300, memory: "12 GB", slots: 2, color: "#76e4c5" }
  },
  {
    id: "gpu-rx7800",
    category: "gpu",
    name: "Radeon RX 7800 XT Forge",
    price: 499,
    wattage: 263,
    specs: { length: 330, memory: "16 GB", slots: 2.5, color: "#ff7b72" }
  },
  {
    id: "ssd-m2",
    category: "storage",
    name: "2 TB NVMe M.2",
    price: 136,
    wattage: 6,
    specs: { interface: "M.2", capacity: "2 TB", speed: "7400 MB/s", color: "#cdb4db" }
  },
  {
    id: "ssd-sata",
    category: "storage",
    name: "4 TB SATA SSD",
    price: 219,
    wattage: 5,
    specs: { interface: "SATA", capacity: "4 TB", speed: "560 MB/s", color: "#f8edeb" }
  },
  {
    id: "psu-650",
    category: "psu",
    name: "650 W Gold Modular",
    price: 98,
    specs: { watts: 650, rating: "80+ Gold", color: "#b8c0c7" }
  },
  {
    id: "psu-850",
    category: "psu",
    name: "850 W Platinum Modular",
    price: 158,
    specs: { watts: 850, rating: "80+ Platinum", color: "#e5e5e5" }
  },
  {
    id: "cooler-air",
    category: "cooler",
    name: "Twin Tower Air Cooler",
    price: 74,
    wattage: 4,
    specs: { socket: "Universal", radiator: 0, style: "Air", color: "#d7e3fc" }
  },
  {
    id: "cooler-aio",
    category: "cooler",
    name: "240 mm Liquid AIO",
    price: 128,
    wattage: 8,
    specs: { socket: "Universal", radiator: 240, style: "Liquid", color: "#90dbf4" }
  }
];

components.push(
  {
    id: "case-atx-2025-airflow",
    category: "case",
    name: "2025 Airflow ATX Tower",
    price: 139,
    specs: { formFactor: "ATX", maxGpu: 420, radiator: 360, release: "2025", color: "#edf2f4" }
  },
  {
    id: "case-atx-creator-xl",
    category: "case",
    name: "Creator XL ATX Workstation",
    price: 219,
    specs: { formFactor: "ATX", maxGpu: 460, radiator: 420, release: "2026", color: "#bfc8d2" }
  },
  {
    id: "case-matx-compact-2024",
    category: "case",
    name: "Compact mATX 2024",
    price: 89,
    specs: { formFactor: "mATX", maxGpu: 330, radiator: 240, release: "2024", color: "#ced4da" }
  },
  {
    id: "case-itx-sff-2025",
    category: "case",
    name: "SFF Mini-ITX 2025",
    price: 159,
    specs: { formFactor: "Mini-ITX", maxGpu: 305, radiator: 240, release: "2025", color: "#adb5bd" }
  },
  {
    id: "mb-x870e-atx",
    category: "motherboard",
    name: "X870E Creator WiFi",
    price: 399,
    specs: { socket: "AM5", ramType: "DDR5", formFactor: "ATX", m2: 5, sata: 4, chipset: "X870E", color: "#1f4f68" }
  },
  {
    id: "mb-x870-atx",
    category: "motherboard",
    name: "X870 Gaming WiFi",
    price: 289,
    specs: { socket: "AM5", ramType: "DDR5", formFactor: "ATX", m2: 4, sata: 4, chipset: "X870", color: "#295f4e" }
  },
  {
    id: "mb-b850-matx",
    category: "motherboard",
    name: "B850M Pro WiFi",
    price: 179,
    specs: { socket: "AM5", ramType: "DDR5", formFactor: "mATX", m2: 3, sata: 4, chipset: "B850", color: "#3a506b" }
  },
  {
    id: "mb-b840-matx",
    category: "motherboard",
    name: "B840M Essential",
    price: 119,
    specs: { socket: "AM5", ramType: "DDR5", formFactor: "mATX", m2: 2, sata: 4, chipset: "B840", color: "#3d405b" }
  },
  {
    id: "mb-z890-atx",
    category: "motherboard",
    name: "Z890 AI Hero",
    price: 379,
    specs: { socket: "LGA1851", ramType: "DDR5", formFactor: "ATX", m2: 5, sata: 4, chipset: "Z890", color: "#17324d" }
  },
  {
    id: "mb-b860-matx",
    category: "motherboard",
    name: "B860M Creator WiFi",
    price: 189,
    specs: { socket: "LGA1851", ramType: "DDR5", formFactor: "mATX", m2: 3, sata: 4, chipset: "B860", color: "#264653" }
  },
  {
    id: "mb-h810-itx",
    category: "motherboard",
    name: "H810I Compact",
    price: 139,
    specs: { socket: "LGA1851", ramType: "DDR5", formFactor: "Mini-ITX", m2: 2, sata: 2, chipset: "H810", color: "#343a40" }
  },
  {
    id: "cpu-9600x",
    category: "cpu",
    name: "Ryzen 5 9600X",
    price: 279,
    wattage: 65,
    specs: { socket: "AM5", cores: 6, boost: "5.4 GHz", release: "2024", color: "#f4a261" }
  },
  {
    id: "cpu-9700x",
    category: "cpu",
    name: "Ryzen 7 9700X",
    price: 359,
    wattage: 65,
    specs: { socket: "AM5", cores: 8, boost: "5.5 GHz", release: "2024", color: "#e9c46a" }
  },
  {
    id: "cpu-9900x",
    category: "cpu",
    name: "Ryzen 9 9900X",
    price: 499,
    wattage: 120,
    specs: { socket: "AM5", cores: 12, boost: "5.6 GHz", release: "2024", color: "#f77f00" }
  },
  {
    id: "cpu-9950x",
    category: "cpu",
    name: "Ryzen 9 9950X",
    price: 649,
    wattage: 170,
    specs: { socket: "AM5", cores: 16, boost: "5.7 GHz", release: "2024", color: "#d62828" }
  },
  {
    id: "cpu-9800x3d",
    category: "cpu",
    name: "Ryzen 7 9800X3D",
    price: 479,
    wattage: 120,
    specs: { socket: "AM5", cores: 8, boost: "5.2 GHz", release: "2024", color: "#ffba08" }
  },
  {
    id: "cpu-9900x3d",
    category: "cpu",
    name: "Ryzen 9 9900X3D",
    price: 599,
    wattage: 120,
    specs: { socket: "AM5", cores: 12, boost: "5.5 GHz", release: "2025", color: "#faa307" }
  },
  {
    id: "cpu-9950x3d",
    category: "cpu",
    name: "Ryzen 9 9950X3D",
    price: 699,
    wattage: 170,
    specs: { socket: "AM5", cores: 16, boost: "5.7 GHz", release: "2025", color: "#dc2f02" }
  },
  {
    id: "cpu-ultra-245k",
    category: "cpu",
    name: "Core Ultra 5 245K",
    price: 309,
    wattage: 125,
    specs: { socket: "LGA1851", cores: 14, boost: "5.2 GHz", release: "2024", color: "#64b5f6" }
  },
  {
    id: "cpu-ultra-265k",
    category: "cpu",
    name: "Core Ultra 7 265K",
    price: 394,
    wattage: 125,
    specs: { socket: "LGA1851", cores: 20, boost: "5.5 GHz", release: "2024", color: "#42a5f5" }
  },
  {
    id: "cpu-ultra-285k",
    category: "cpu",
    name: "Core Ultra 9 285K",
    price: 589,
    wattage: 125,
    specs: { socket: "LGA1851", cores: 24, boost: "5.7 GHz", release: "2024", color: "#1e88e5" }
  },
  {
    id: "cpu-ultra-250k-plus",
    category: "cpu",
    name: "Core Ultra 5 250K Plus",
    price: 199,
    wattage: 125,
    specs: { socket: "LGA1851", cores: 18, boost: "Series 2+", release: "2026", color: "#90caf9" }
  },
  {
    id: "cpu-ultra-270k-plus",
    category: "cpu",
    name: "Core Ultra 7 270K Plus",
    price: 299,
    wattage: 125,
    specs: { socket: "LGA1851", cores: 24, boost: "Series 2+", release: "2026", color: "#2196f3" }
  },
  {
    id: "ram-ddr5-32-6400",
    category: "ram",
    name: "32 GB DDR5-6400 Kit",
    price: 132,
    wattage: 10,
    specs: { ramType: "DDR5", capacity: "32 GB", speed: "6400 MT/s", release: "2024", color: "#95d5b2" }
  },
  {
    id: "ram-ddr5-64-6000",
    category: "ram",
    name: "64 GB DDR5-6000 Kit",
    price: 218,
    wattage: 14,
    specs: { ramType: "DDR5", capacity: "64 GB", speed: "6000 MT/s", release: "2025", color: "#80ed99" }
  },
  {
    id: "ram-cudimm-64-8000",
    category: "ram",
    name: "64 GB DDR5 CUDIMM-8000",
    price: 289,
    wattage: 16,
    specs: { ramType: "DDR5", capacity: "64 GB", speed: "8000 MT/s", release: "2026", color: "#b7e4c7" }
  },
  {
    id: "ram-cudimm-128-7200",
    category: "ram",
    name: "128 GB 4R CUDIMM Kit",
    price: 549,
    wattage: 24,
    specs: { ramType: "DDR5", capacity: "128 GB", speed: "7200 MT/s", release: "2026", color: "#d8f3dc" }
  },
  {
    id: "gpu-rtx-5090",
    category: "gpu",
    name: "GeForce RTX 5090",
    price: 1999,
    wattage: 575,
    specs: { length: 340, memory: "32 GB GDDR7", slots: 2.5, release: "2025", color: "#76ff03" }
  },
  {
    id: "gpu-rtx-5080",
    category: "gpu",
    name: "GeForce RTX 5080",
    price: 999,
    wattage: 360,
    specs: { length: 320, memory: "16 GB GDDR7", slots: 2.5, release: "2025", color: "#9cff57" }
  },
  {
    id: "gpu-rtx-5070ti",
    category: "gpu",
    name: "GeForce RTX 5070 Ti",
    price: 749,
    wattage: 300,
    specs: { length: 310, memory: "16 GB GDDR7", slots: 2.5, release: "2025", color: "#b7ff77" }
  },
  {
    id: "gpu-rtx-5070",
    category: "gpu",
    name: "GeForce RTX 5070",
    price: 549,
    wattage: 250,
    specs: { length: 285, memory: "12 GB GDDR7", slots: 2, release: "2025", color: "#caff8a" }
  },
  {
    id: "gpu-rtx-5060ti",
    category: "gpu",
    name: "GeForce RTX 5060 Ti",
    price: 429,
    wattage: 180,
    specs: { length: 245, memory: "16 GB GDDR7", slots: 2, release: "2025", color: "#ddff99" }
  },
  {
    id: "gpu-rx-9070xt",
    category: "gpu",
    name: "Radeon RX 9070 XT",
    price: 599,
    wattage: 304,
    specs: { length: 310, memory: "16 GB GDDR6", slots: 2, release: "2025", color: "#ff595e" }
  },
  {
    id: "gpu-rx-9070",
    category: "gpu",
    name: "Radeon RX 9070",
    price: 549,
    wattage: 220,
    specs: { length: 285, memory: "16 GB GDDR6", slots: 2, release: "2025", color: "#ff758f" }
  },
  {
    id: "gpu-rx-9060xt",
    category: "gpu",
    name: "Radeon RX 9060 XT",
    price: 349,
    wattage: 160,
    specs: { length: 250, memory: "16 GB GDDR6", slots: 2, release: "2025", color: "#ff8fa3" }
  },
  {
    id: "ssd-crucial-t705-2tb",
    category: "storage",
    name: "Crucial T705 2 TB Gen5",
    price: 269,
    wattage: 11,
    specs: { interface: "M.2", capacity: "2 TB", speed: "14,500 MB/s", release: "2024", color: "#cdb4db" }
  },
  {
    id: "ssd-samsung-9100-4tb",
    category: "storage",
    name: "Samsung 9100 PRO 4 TB",
    price: 429,
    wattage: 9,
    specs: { interface: "M.2", capacity: "4 TB", speed: "14,800 MB/s", release: "2025", color: "#bde0fe" }
  },
  {
    id: "ssd-wd-sn8100-2tb",
    category: "storage",
    name: "WD Black SN8100 2 TB",
    price: 249,
    wattage: 8,
    specs: { interface: "M.2", capacity: "2 TB", speed: "14,900 MB/s", release: "2025", color: "#f1faee" }
  },
  {
    id: "ssd-pcie4-value-4tb",
    category: "storage",
    name: "4 TB PCIe 4.0 NVMe",
    price: 239,
    wattage: 6,
    specs: { interface: "M.2", capacity: "4 TB", speed: "7,400 MB/s", release: "2024", color: "#e0fbfc" }
  },
  {
    id: "ssd-sata-8tb-2026",
    category: "storage",
    name: "8 TB SATA SSD",
    price: 499,
    wattage: 6,
    specs: { interface: "SATA", capacity: "8 TB", speed: "560 MB/s", release: "2026", color: "#fff1e6" }
  },
  {
    id: "psu-750-atx31",
    category: "psu",
    name: "750 W Gold ATX 3.1",
    price: 119,
    specs: { watts: 750, rating: "80+ Gold", connector: "12V-2x6", color: "#dee2e6" }
  },
  {
    id: "psu-850-atx31",
    category: "psu",
    name: "850 W Gold ATX 3.1",
    price: 149,
    specs: { watts: 850, rating: "80+ Gold", connector: "12V-2x6", color: "#e9ecef" }
  },
  {
    id: "psu-1000-atx31",
    category: "psu",
    name: "1000 W Platinum ATX 3.1",
    price: 229,
    specs: { watts: 1000, rating: "80+ Platinum", connector: "12V-2x6", color: "#f8f9fa" }
  },
  {
    id: "psu-1200-atx31",
    category: "psu",
    name: "1200 W Titanium ATX 3.1",
    price: 329,
    specs: { watts: 1200, rating: "80+ Titanium", connector: "12V-2x6", color: "#ffffff" }
  },
  {
    id: "cooler-air-2025-dual",
    category: "cooler",
    name: "Dual Tower 2025 Air",
    price: 89,
    wattage: 5,
    specs: { socket: "Universal", radiator: 0, style: "Air", release: "2025", color: "#d7e3fc" }
  },
  {
    id: "cooler-aio-360",
    category: "cooler",
    name: "360 mm Liquid AIO",
    price: 179,
    wattage: 10,
    specs: { socket: "Universal", radiator: 360, style: "Liquid", release: "2025", color: "#8ecae6" }
  },
  {
    id: "cooler-aio-420",
    category: "cooler",
    name: "420 mm Liquid AIO",
    price: 239,
    wattage: 12,
    specs: { socket: "Universal", radiator: 420, style: "Liquid", release: "2026", color: "#48cae4" }
  }
);

const requiredSlots = ["case", "motherboard", "cpu", "ram", "gpu", "storage", "psu", "cooler"];
const build = Object.fromEntries(requiredSlots.map((slot) => [slot, null]));
const filters = {
  search: "",
  year: "all",
  price: "all",
  socket: "all",
  ramType: "all",
  formFactor: "all",
  power: "all"
};
let selectedCategory = "case";
let draggedId = null;

const categoryTabs = document.querySelector("#categoryTabs");
const componentFilters = document.querySelector("#componentFilters");
const searchInput = document.querySelector("#searchInput");
const yearFilter = document.querySelector("#yearFilter");
const priceFilter = document.querySelector("#priceFilter");
const socketFilter = document.querySelector("#socketFilter");
const ramTypeFilter = document.querySelector("#ramTypeFilter");
const formFactorFilter = document.querySelector("#formFactorFilter");
const powerFilter = document.querySelector("#powerFilter");
const resultCount = document.querySelector("#resultCount");
const clearFilters = document.querySelector("#clearFilters");
const componentList = document.querySelector("#componentList");
const slotsEl = document.querySelector("#slots");
const statusDot = document.querySelector("#statusDot");
const statusTitle = document.querySelector("#statusTitle");
const statusSubtitle = document.querySelector("#statusSubtitle");
const compatList = document.querySelector("#compatList");
const wattageEl = document.querySelector("#wattage");
const totalPriceEl = document.querySelector("#totalPrice");

function findComponent(id) {
  return components.find((part) => part.id === id);
}

function formatSpecKey(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function renderCategories() {
  categoryTabs.innerHTML = categories
    .map(
      (category) =>
        `<button class="category-tab" type="button" data-category="${category.id}" aria-selected="${category.id === selectedCategory}">${category.label}</button>`
    )
    .join("");
}

function uniqueSpecValues(key) {
  return [...new Set(components.map((part) => part.specs[key]).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b), undefined, { numeric: true })
  );
}

function populateSelect(select, values) {
  const current = select.value;
  const firstOption = select.querySelector("option[value='all']").outerHTML;
  select.innerHTML = `${firstOption}${values.map((value) => `<option value="${value}">${value}</option>`).join("")}`;
  select.value = values.includes(current) ? current : "all";
}

function renderFilterOptions() {
  populateSelect(yearFilter, uniqueSpecValues("release"));
  populateSelect(socketFilter, uniqueSpecValues("socket").filter((value) => value !== "Universal"));
  populateSelect(ramTypeFilter, uniqueSpecValues("ramType"));
  populateSelect(formFactorFilter, uniqueSpecValues("formFactor"));
}

function searchableText(part) {
  return [
    part.name,
    part.category,
    categories.find((category) => category.id === part.category)?.label,
    ...Object.entries(part.specs).flat()
  ]
    .join(" ")
    .toLowerCase();
}

function matchesPowerFilter(part) {
  if (filters.power === "all") return true;
  const watts = part.wattage ?? part.specs.watts ?? 0;
  if (filters.power === "low") return watts > 0 && watts <= 100;
  if (filters.power === "mid") return watts > 100 && watts <= 300;
  return watts > 300;
}

function partMatchesFilters(part) {
  const search = filters.search.trim().toLowerCase();
  if (search && !searchableText(part).includes(search)) return false;
  if (filters.year !== "all" && String(part.specs.release) !== filters.year) return false;
  if (filters.price !== "all" && part.price > Number(filters.price)) return false;
  if (filters.socket !== "all" && part.specs.socket !== filters.socket) return false;
  if (filters.ramType !== "all" && part.specs.ramType !== filters.ramType) return false;
  if (filters.formFactor !== "all" && part.specs.formFactor !== filters.formFactor) return false;
  return matchesPowerFilter(part);
}

function renderComponents() {
  const filtered = components.filter((part) => part.category === selectedCategory && partMatchesFilters(part));
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "part" : "parts"}`;
  componentList.innerHTML = filtered.length
    ? filtered.map(renderComponentCard).join("")
    : `<div class="empty-state">No ${categories.find((category) => category.id === selectedCategory).label.toLowerCase()} parts match the current filters.</div>`;
}

function renderComponentCard(part) {
  const specs = Object.entries(part.specs)
    .slice(0, 4)
    .map(([key, value]) => `<div class="spec-row"><span>${formatSpecKey(key)}</span><strong>${value}</strong></div>`)
    .join("");

  return `
    <article class="component-card" draggable="true" data-id="${part.id}" tabindex="0" aria-label="${part.name}">
      <div class="card-top">
        <h3>${part.name}</h3>
        <span class="price">$${part.price}</span>
      </div>
      <span class="badge">${categories.find((category) => category.id === part.category).label}</span>
      <div class="specs">${specs}</div>
    </article>
  `;
}

function renderSlots() {
  slotsEl.innerHTML = requiredSlots
    .map((slot) => {
      const part = build[slot];
      const title = categories.find((category) => category.id === slot).label;
      const content = part
        ? `<div class="slot-part">
            <strong>${part.name}</strong>
            <span class="slot-empty">${slotSummary(part)}</span>
          </div>
          <button class="remove-part" type="button" data-remove="${slot}">Remove</button>`
        : `<span class="slot-empty">Drop a ${title.toLowerCase()} here</span>`;

      return `
        <section class="slot" data-slot="${slot}">
          <div class="slot-top">
            <span class="slot-title">${title}</span>
            ${part ? "" : '<span class="badge">Empty</span>'}
          </div>
          ${content}
        </section>
      `;
    })
    .join("");
}

function slotSummary(part) {
  if (part.category === "psu") return `${part.specs.watts} W, ${part.specs.rating}`;
  if (part.category === "cpu") return `${part.specs.socket}, ${part.specs.cores} cores`;
  if (part.category === "ram") return `${part.specs.capacity}, ${part.specs.ramType}`;
  if (part.category === "gpu") return `${part.specs.memory}, ${part.specs.length} mm`;
  if (part.category === "storage") return `${part.specs.capacity}, ${part.specs.interface}`;
  if (part.category === "motherboard") return `${part.specs.chipset ?? part.specs.formFactor}, ${part.specs.socket}`;
  if (part.category === "case") return `${part.specs.formFactor}, ${part.specs.maxGpu} mm GPU`;
  return `${part.specs.style}`;
}

function estimateWattage() {
  return Object.values(build).reduce((sum, part) => sum + (part?.wattage ?? 0), 50);
}

function estimatePrice() {
  return Object.values(build).reduce((sum, part) => sum + (part?.price ?? 0), 0);
}

function evaluateCompatibility() {
  const notes = [];
  const errors = [];
  const warnings = [];
  const selectedCount = Object.values(build).filter(Boolean).length;
  const board = build.motherboard;
  const cpu = build.cpu;
  const ram = build.ram;
  const pcCase = build.case;
  const gpu = build.gpu;
  const storage = build.storage;
  const psu = build.psu;
  const cooler = build.cooler;
  const estimated = estimateWattage();

  if (board && cpu) {
    if (board.specs.socket !== cpu.specs.socket) errors.push(`CPU socket ${cpu.specs.socket} does not match motherboard socket ${board.specs.socket}.`);
    else notes.push(`Processor and motherboard both use ${cpu.specs.socket}.`);
  }

  if (board && ram) {
    if (board.specs.ramType !== ram.specs.ramType) errors.push(`${ram.specs.ramType} memory cannot be installed on a ${board.specs.ramType} motherboard.`);
    else notes.push(`${ram.specs.ramType} memory matches the motherboard.`);
  }

  if (pcCase && board) {
    const order = { "Mini-ITX": 0, "mATX": 1, ATX: 2 };
    if (order[board.specs.formFactor] > order[pcCase.specs.formFactor]) errors.push(`${board.specs.formFactor} motherboard is too large for the ${pcCase.specs.formFactor} case.`);
    else notes.push(`${board.specs.formFactor} motherboard fits inside the case.`);
  }

  if (pcCase && gpu) {
    if (gpu.specs.length > pcCase.specs.maxGpu) errors.push(`${gpu.name} is ${gpu.specs.length} mm, longer than the case limit of ${pcCase.specs.maxGpu} mm.`);
    else notes.push(`GPU length fits with ${pcCase.specs.maxGpu - gpu.specs.length} mm to spare.`);
  }

  if (board && storage) {
    if (storage.specs.interface === "M.2" && board.specs.m2 < 1) errors.push("Selected motherboard has no M.2 slot.");
    if (storage.specs.interface === "SATA" && board.specs.sata < 1) errors.push("Selected motherboard has no SATA port.");
    if (!errors.some((error) => error.includes("slot") || error.includes("SATA"))) notes.push(`${storage.specs.interface} storage is supported.`);
  }

  if (pcCase && cooler?.specs.radiator > pcCase.specs.radiator) {
    errors.push(`${cooler.name} needs a ${cooler.specs.radiator} mm mount, but the case supports ${pcCase.specs.radiator} mm.`);
  } else if (pcCase && cooler) {
    notes.push(`${cooler.name} fits the cooling layout.`);
  }

  if (psu) {
    const recommended = Math.ceil(estimated * 1.35);
    if (psu.specs.watts < recommended) errors.push(`${psu.name} is below the recommended ${recommended} W for this build.`);
    else notes.push(`${psu.specs.watts} W power supply has enough headroom.`);

    if (gpu?.name.includes("GeForce RTX 50") && psu.specs.connector !== "12V-2x6") {
      warnings.push("RTX 50-series cards are best paired with an ATX 3.1 PSU with a native 12V-2x6 cable.");
    }
  } else if (estimated > 50) {
    warnings.push("Add a power supply to validate power headroom.");
  }

  if (ram?.name.includes("CUDIMM") && board && !["Z890", "B860", "H810"].includes(board.specs.chipset)) {
    warnings.push("CUDIMM memory works best on newer Intel 800-series boards; confirm BIOS support before buying.");
  }

  if (selectedCount < requiredSlots.length) warnings.push(`${requiredSlots.length - selectedCount} required component slots still empty.`);

  return { notes, errors, warnings, estimated };
}

function renderStatus() {
  const { notes, errors, warnings, estimated } = evaluateCompatibility();
  wattageEl.textContent = `${estimated} W`;
  totalPriceEl.textContent = `$${estimatePrice().toLocaleString("en-US")}`;
  statusDot.className = "status-dot";

  if (errors.length) {
    statusDot.classList.add("bad");
    statusTitle.textContent = "Compatibility problem";
    statusSubtitle.textContent = "Swap the highlighted component choices before ordering parts.";
  } else if (warnings.length) {
    statusDot.classList.add("warn");
    statusTitle.textContent = "Build in progress";
    statusSubtitle.textContent = "No hard conflicts yet. Finish the remaining slots.";
  } else {
    statusDot.classList.add("ok");
    statusTitle.textContent = "Compatible build";
    statusSubtitle.textContent = "All selected components can be assembled together.";
  }

  compatList.innerHTML = [...errors, ...warnings, ...notes].slice(0, 8).map((item) => `<li>${item}</li>`).join("");
}

function canDrop(part, slot) {
  return part.category === slot;
}

function setPart(partId, slot) {
  const part = findComponent(partId);
  if (!part || !canDrop(part, slot)) return;
  build[slot] = part;
  renderAll();
  updateModel(build);
}

function renderAll() {
  renderCategories();
  renderComponents();
  renderSlots();
  renderStatus();
}

categoryTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  renderAll();
});

componentFilters.addEventListener("input", () => {
  filters.search = searchInput.value;
  filters.year = yearFilter.value;
  filters.price = priceFilter.value;
  filters.socket = socketFilter.value;
  filters.ramType = ramTypeFilter.value;
  filters.formFactor = formFactorFilter.value;
  filters.power = powerFilter.value;
  renderComponents();
});

componentFilters.addEventListener("submit", (event) => {
  event.preventDefault();
});

clearFilters.addEventListener("click", () => {
  filters.search = "";
  filters.year = "all";
  filters.price = "all";
  filters.socket = "all";
  filters.ramType = "all";
  filters.formFactor = "all";
  filters.power = "all";
  componentFilters.reset();
  renderComponents();
});

componentList.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[data-id]");
  if (!card) return;
  draggedId = card.dataset.id;
  event.dataTransfer.setData("text/plain", draggedId);
});

componentList.addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-id]");
  if (!card || event.key !== "Enter") return;
  const part = findComponent(card.dataset.id);
  setPart(part.id, part.category);
});

slotsEl.addEventListener("dragover", (event) => {
  const slot = event.target.closest("[data-slot]");
  if (!slot) return;
  const part = findComponent(draggedId || event.dataTransfer.getData("text/plain"));
  if (!part) return;
  event.preventDefault();
  slot.classList.toggle("is-incompatible", !canDrop(part, slot.dataset.slot));
  slot.classList.toggle("is-over", canDrop(part, slot.dataset.slot));
});

slotsEl.addEventListener("dragleave", (event) => {
  const slot = event.target.closest("[data-slot]");
  slot?.classList.remove("is-over", "is-incompatible");
});

slotsEl.addEventListener("drop", (event) => {
  const slot = event.target.closest("[data-slot]");
  if (!slot) return;
  event.preventDefault();
  slot.classList.remove("is-over", "is-incompatible");
  const partId = event.dataTransfer.getData("text/plain");
  setPart(partId, slot.dataset.slot);
});

slotsEl.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (!removeButton) return;
  build[removeButton.dataset.remove] = null;
  renderAll();
  updateModel(build);
});

document.querySelector("#resetBuild").addEventListener("click", () => {
  requiredSlots.forEach((slot) => {
    build[slot] = null;
  });
  renderAll();
  updateModel(build);
});

const canvas = document.querySelector("#pcScene");
const scene = new THREE.Scene();
scene.background = new THREE.Color("#0c0f12");

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(5.2, 3.7, 6.6);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.5, 0);
controls.minDistance = 4;
controls.maxDistance = 11;

scene.add(new THREE.HemisphereLight("#dceeff", "#202026", 1.4));
const keyLight = new THREE.DirectionalLight("#ffffff", 1.2);
keyLight.position.set(4, 6, 5);
keyLight.castShadow = true;
scene.add(keyLight);

const modelRoot = new THREE.Group();
scene.add(modelRoot);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(4.2, 80),
  new THREE.MeshStandardMaterial({ color: "#151a1f", roughness: 0.85 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.58,
    metalness: 0.22,
    ...options
  });
}

function box(name, size, position, color, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color, options));
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  modelRoot.add(mesh);
  return mesh;
}

function cylinder(name, radius, depth, position, color) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 36), material(color));
  mesh.name = name;
  mesh.position.set(...position);
  mesh.rotation.z = Math.PI / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  modelRoot.add(mesh);
  return mesh;
}

function clearModel() {
  while (modelRoot.children.length) {
    const child = modelRoot.children.pop();
    child.geometry?.dispose();
    child.material?.dispose();
  }
}

function updateModel(parts) {
  clearModel();

  const caseColor = parts.case?.specs.color ?? "#434b55";
  box("case-back", [2.6, 3.2, 0.12], [0, 1.65, -0.82], caseColor, { metalness: 0.35 });
  box("case-bottom", [2.6, 0.12, 1.75], [0, 0.08, 0], "#29313a");
  box("case-top", [2.6, 0.12, 1.75], [0, 3.22, 0], "#29313a");
  box("case-front", [0.12, 3.2, 1.75], [-1.3, 1.65, 0], "#222a31");
  box("glass-panel", [0.045, 3.02, 1.62], [1.32, 1.68, 0], "#8fc7ff", {
    transparent: true,
    opacity: 0.2,
    roughness: 0.08,
    metalness: 0
  });

  const boardColor = parts.motherboard?.specs.color ?? "#26313a";
  box("motherboard", [0.08, 2.2, 1.24], [0.15, 1.75, -0.74], boardColor);

  if (parts.cpu) {
    box("cpu", [0.1, 0.45, 0.45], [0.23, 1.95, -0.38], parts.cpu.specs.color);
  } else {
    box("cpu-empty", [0.09, 0.42, 0.42], [0.23, 1.95, -0.38], "#555f68");
  }

  if (parts.cooler) {
    if (parts.cooler.specs.style === "Liquid") {
      box("aio-radiator", [0.18, 1.22, 0.34], [-1.16, 2.08, 0.2], parts.cooler.specs.color);
      cylinder("aio-fan-top", 0.22, 0.08, [-1.04, 2.38, 0.2], "#1f252b");
      cylinder("aio-fan-bottom", 0.22, 0.08, [-1.04, 1.78, 0.2], "#1f252b");
      box("pump", [0.24, 0.34, 0.34], [0.36, 1.95, -0.38], "#20252a");
    } else {
      box("air-cooler", [0.38, 0.78, 0.56], [0.4, 2.05, -0.38], parts.cooler.specs.color);
      cylinder("cooler-fan", 0.26, 0.09, [0.62, 2.05, -0.38], "#1f252b");
    }
  }

  const ramColor = parts.ram?.specs.color ?? "#505c66";
  for (let index = 0; index < 4; index += 1) {
    box(`ram-${index}`, [0.11, 0.78, 0.055], [0.35, 1.43 + index * 0.12, -0.05], index < 2 && parts.ram ? ramColor : "#38424a");
  }

  if (parts.gpu) {
    box("gpu-body", [1.42, 0.28, 0.52], [0.35, 1.12, 0.03], parts.gpu.specs.color);
    cylinder("gpu-fan-left", 0.16, 0.05, [0.05, 1.12, 0.32], "#12161a");
    cylinder("gpu-fan-right", 0.16, 0.05, [0.62, 1.12, 0.32], "#12161a");
  } else {
    box("gpu-slot", [1.2, 0.08, 0.1], [0.25, 1.1, -0.13], "#4a545e");
  }

  if (parts.storage) {
    const isM2 = parts.storage.specs.interface === "M.2";
    box("storage", isM2 ? [0.08, 0.58, 0.12] : [0.56, 0.16, 0.46], isM2 ? [0.26, 1.42, -0.49] : [-0.82, 0.62, 0.43], parts.storage.specs.color);
  }

  if (parts.psu) {
    box("psu", [1.0, 0.42, 0.78], [-0.45, 0.38, -0.1], parts.psu.specs.color);
    cylinder("psu-fan", 0.22, 0.06, [-0.15, 0.38, 0.33], "#151a1f");
  } else {
    box("psu-placeholder", [1.0, 0.42, 0.78], [-0.45, 0.38, -0.1], "#313941");
  }
}

function resize() {
  const { clientWidth, clientHeight } = canvas.parentElement;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resize);

document.querySelector("#rotateLeft").addEventListener("click", () => {
  modelRoot.rotation.y -= Math.PI / 8;
});

document.querySelector("#rotateRight").addEventListener("click", () => {
  modelRoot.rotation.y += Math.PI / 8;
});

document.querySelector("#fitView").addEventListener("click", () => {
  camera.position.set(5.2, 3.7, 6.6);
  controls.target.set(0, 1.5, 0);
});

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

renderFilterOptions();
renderAll();
updateModel(build);
resize();
animate();
