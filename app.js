import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { feedComponents } from "./data/feed-components.js";

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

components.push(...feedComponents);

const motherboardProfiles = {
  A620: { pcie5Storage: false, pcie5Gpu: false, maxRamSpeed: 6400, generation: "AMD Ryzen 7000/8000/9000" },
  B650: { pcie5Storage: true, pcie5Gpu: false, maxRamSpeed: 6400, generation: "AMD Ryzen 7000/8000/9000" },
  B650E: { pcie5Storage: true, pcie5Gpu: true, maxRamSpeed: 6400, generation: "AMD Ryzen 7000/8000/9000" },
  X670: { pcie5Storage: true, pcie5Gpu: false, maxRamSpeed: 6400, generation: "AMD Ryzen 7000/8000/9000" },
  X670E: { pcie5Storage: true, pcie5Gpu: true, maxRamSpeed: 6400, generation: "AMD Ryzen 7000/8000/9000" },
  B450: { pcie5Storage: false, pcie5Gpu: false, maxRamSpeed: 3600, generation: "AMD Ryzen AM4" },
  B550: { pcie5Storage: false, pcie5Gpu: true, maxRamSpeed: 4400, generation: "AMD Ryzen AM4" },
  X570: { pcie5Storage: false, pcie5Gpu: true, maxRamSpeed: 4400, generation: "AMD Ryzen AM4" },
  B760: { pcie5Storage: false, pcie5Gpu: true, maxRamSpeed: 5600, generation: "Intel 12th/13th/14th Gen" },
  B660: { pcie5Storage: false, pcie5Gpu: true, maxRamSpeed: 5600, generation: "Intel 12th/13th/14th Gen" },
  H610: { pcie5Storage: false, pcie5Gpu: false, maxRamSpeed: 5600, generation: "Intel 12th/13th/14th Gen" },
  Z790: { pcie5Storage: true, pcie5Gpu: true, maxRamSpeed: 7600, generation: "Intel 12th/13th/14th Gen" },
  H510: { pcie5Storage: false, pcie5Gpu: false, maxRamSpeed: 3200, generation: "Intel 10th/11th Gen" },
  X870E: { pcie5Storage: true, pcie5Gpu: true, maxRamSpeed: 8000, generation: "AMD Ryzen 7000/8000/9000" },
  X870: { pcie5Storage: true, pcie5Gpu: true, maxRamSpeed: 8000, generation: "AMD Ryzen 7000/8000/9000" },
  B850: { pcie5Storage: true, pcie5Gpu: false, maxRamSpeed: 7600, generation: "AMD Ryzen 7000/8000/9000" },
  B840: { pcie5Storage: false, pcie5Gpu: false, maxRamSpeed: 6400, generation: "AMD Ryzen 7000/8000/9000" },
  Z890: { pcie5Storage: true, pcie5Gpu: true, maxRamSpeed: 8800, generation: "Intel Core Ultra 200" },
  B860: { pcie5Storage: true, pcie5Gpu: true, maxRamSpeed: 8000, generation: "Intel Core Ultra 200" },
  H810: { pcie5Storage: false, pcie5Gpu: true, maxRamSpeed: 6400, generation: "Intel Core Ultra 200" }
};

const formFactorProfiles = {
  "Mini-ITX": { maxGpuSlots: 2.5, maxAirCoolerHeight: 75 },
  mATX: { maxGpuSlots: 3, maxAirCoolerHeight: 160 },
  ATX: { maxGpuSlots: 4, maxAirCoolerHeight: 175 }
};

function parseNumber(value) {
  const match = String(value ?? "").replace(/,/g, "").match(/\d+/);
  return match ? Number(match[0]) : null;
}

function enrichCompatibilityData() {
  components.forEach((part) => {
    const specs = part.specs;

    if (part.category === "motherboard") {
      const chipset = specs.chipset ?? (part.name.match(/\b(X870E|X870|X670E|X670|B850|B840|B650E|B650|A620|Z890|B860|H810|Z790|B760|B660|H610|B550|B450|X570|H510)\b/)?.[1]);
      if (chipset) specs.chipset = chipset;
      Object.assign(specs, motherboardProfiles[chipset] ?? {});
    }

    if (part.category === "case") {
      Object.assign(specs, formFactorProfiles[specs.formFactor] ?? {});
      specs.maxAirCoolerHeight ??= specs.formFactor === "Mini-ITX" ? 75 : specs.radiator >= 360 ? 175 : 160;
    }

    if (part.category === "cpu") {
      specs.generation ??= specs.socket === "AM5" ? "AMD Ryzen 7000/8000/9000" : specs.socket === "LGA1851" ? "Intel Core Ultra 200" : "Intel 12th/13th/14th Gen";
    }

    if (part.category === "ram") {
      specs.speedMt ??= parseNumber(specs.speed);
      specs.modules ??= part.name.includes("128 GB") ? 4 : 2;
      specs.isCudimm = part.name.includes("CUDIMM");
    }

    if (part.category === "gpu") {
      specs.pcieGeneration ??= part.name.includes("RTX 50") || part.name.includes("RX 90") ? 5 : 4;
      specs.connector ??= part.name.includes("RTX 50") ? "12V-2x6" : "PCIe 8-pin";
    }

    if (part.category === "storage") {
      const speed = parseNumber(specs.speed);
      specs.pcieGeneration ??= specs.interface === "M.2" && speed && speed > 10000 ? 5 : specs.interface === "M.2" ? 4 : 3;
    }

    if (part.category === "psu") {
      specs.connector ??= specs.watts >= 750 ? "12V-2x6" : "PCIe 8-pin";
    }

    if (part.category === "cooler") {
      specs.supportedSockets ??= ["AM5", "LGA1700", "LGA1851"];
      specs.height ??= specs.style === "Air" ? (part.name.includes("Dual") || part.name.includes("Twin") ? 158 : 150) : 55;
      specs.coolingCapacity ??= specs.style === "Liquid" ? Math.max(220, specs.radiator || 240) : 180;
      if (specs.radiator >= 360) specs.coolingCapacity = 300;
      if (specs.radiator >= 420) specs.coolingCapacity = 350;
    }
  });
}

enrichCompatibilityData();

const requiredSlots = ["case", "motherboard", "cpu", "ram", "gpu", "storage", "psu", "cooler"];
const multiSlots = new Set(["ram", "storage"]);
const savedBuildsKey = "pc-builder-emulator.saved-builds";
const build = Object.fromEntries(requiredSlots.map((slot) => [slot, multiSlots.has(slot) ? [] : null]));
const buildPresets = [
  {
    id: "gaming",
    name: "Gaming PC",
    description: "Fast AM5 gaming build with RTX 5080 and Gen5 storage.",
    build: {
      case: "case-atx-2025-airflow",
      motherboard: "mb-x870-atx",
      cpu: "cpu-9800x3d",
      ram: ["ram-ddr5-32-6400"],
      gpu: "gpu-rtx-5080",
      storage: ["ssd-wd-sn8100-2tb"],
      psu: "psu-1000-atx31",
      cooler: "cooler-aio-360"
    }
  },
  {
    id: "office",
    name: "Office PC",
    description: "Quiet mATX build for daily work, multitasking, and light graphics.",
    build: {
      case: "case-matx-compact-2024",
      motherboard: "mb-b840-matx",
      cpu: "cpu-9600x",
      ram: ["ram-ddr5-32"],
      gpu: "gpu-4070",
      storage: ["ssd-pcie4-value-4tb"],
      psu: "psu-750-atx31",
      cooler: "cooler-air-2025-dual"
    }
  },
  {
    id: "creator",
    name: "Creator Workstation",
    description: "High-core Ryzen build with large memory and mixed fast/bulk storage.",
    build: {
      case: "case-atx-creator-xl",
      motherboard: "mb-x870e-atx",
      cpu: "cpu-9950x",
      ram: ["ram-ddr5-64-6000"],
      gpu: "gpu-rtx-5080",
      storage: ["ssd-samsung-9100-4tb", "ssd-sata-8tb-2026"],
      psu: "psu-1200-atx31",
      cooler: "cooler-aio-420"
    }
  },
  {
    id: "budget",
    name: "Budget Build",
    description: "Balanced mATX gaming/work build using practical midrange parts.",
    build: {
      case: "case-matx-compact-2024",
      motherboard: "mb-b850-matx",
      cpu: "cpu-9600x",
      ram: ["ram-ddr5-32"],
      gpu: "gpu-rx7800",
      storage: ["ssd-m2"],
      psu: "psu-750-atx31",
      cooler: "cooler-air-2025-dual"
    }
  },
  {
    id: "high-end",
    name: "High-end Build",
    description: "Flagship Intel/NVIDIA build with CUDIMM memory and top-tier power.",
    build: {
      case: "case-atx-creator-xl",
      motherboard: "mb-z890-atx",
      cpu: "cpu-ultra-285k",
      ram: ["ram-cudimm-64-8000"],
      gpu: "gpu-rtx-5090",
      storage: ["ssd-samsung-9100-4tb", "ssd-wd-sn8100-2tb"],
      psu: "psu-1200-atx31",
      cooler: "cooler-aio-420"
    }
  }
];
const filters = {
  search: "",
  price: "all",
  socket: "all",
  ramType: "all",
  formFactor: "all"
};
let selectedCategory = "case";
let draggedId = null;
let activePresetId = null;

const categoryTabs = document.querySelector("#categoryTabs");
const presetGrid = document.querySelector("#presetGrid");
const componentFilters = document.querySelector("#componentFilters");
const searchInput = document.querySelector("#searchInput");
const priceFilter = document.querySelector("#priceFilter");
const socketFilter = document.querySelector("#socketFilter");
const ramTypeFilter = document.querySelector("#ramTypeFilter");
const formFactorFilter = document.querySelector("#formFactorFilter");
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
const summaryStatus = document.querySelector("#summaryStatus");
const summaryMetrics = document.querySelector("#summaryMetrics");
const summaryParts = document.querySelector("#summaryParts");
const summaryReview = document.querySelector("#summaryReview");
const saveBuildForm = document.querySelector("#saveBuildForm");
const buildNameInput = document.querySelector("#buildNameInput");
const savedCount = document.querySelector("#savedCount");
const savedBuildsEl = document.querySelector("#savedBuilds");

function findComponent(id) {
  return components.find((part) => part.id === id);
}

function formatSpecKey(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(amount, currency = "USD") {
  const symbols = { USD: "$", EUR: "€" };
  const value = Number(amount || 0).toLocaleString("en-US", { maximumFractionDigits: 2 });
  return `${symbols[currency] ?? `${currency} `}${value}`;
}

function partCurrency(part) {
  return part?.specs?.currency ?? "USD";
}

function buildPriceLabel() {
  const parts = selectedParts();
  const currencies = [...new Set(parts.map(partCurrency))];
  if (!parts.length) return "$0";
  if (currencies.length > 1) return "Mixed";
  return formatCurrency(estimatePrice(), currencies[0]);
}

function renderCategories() {
  categoryTabs.innerHTML = categories
    .map(
      (category) =>
        `<button class="category-tab" type="button" data-category="${category.id}" aria-selected="${category.id === selectedCategory}">${category.label}</button>`
    )
    .join("");
}

function presetMetrics(preset) {
  const parts = Object.values(preset.build)
    .flat()
    .map(findComponent)
    .filter(Boolean);
  const currencies = [...new Set(parts.map(partCurrency))];
  const price = parts.reduce((sum, part) => sum + (part.price ?? 0), 0);
  const wattage = parts.reduce((sum, part) => sum + (part.wattage ?? 0), 50);
  const priceLabel = currencies.length > 1 ? "Mixed" : formatCurrency(price, currencies[0] ?? "USD");
  return { priceLabel, wattage, partCount: parts.length };
}

function renderPresets() {
  presetGrid.innerHTML = buildPresets
    .map((preset) => {
      const metrics = presetMetrics(preset);
      return `<button class="preset-card" type="button" data-preset="${preset.id}" aria-pressed="${preset.id === activePresetId}">
        <span>${escapeHtml(preset.name)}</span>
        <strong>${metrics.priceLabel} · ${metrics.wattage} W</strong>
        <small>${escapeHtml(preset.description)}</small>
      </button>`;
    })
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

function partMatchesFilters(part) {
  const search = filters.search.trim().toLowerCase();
  if (search && !searchableText(part).includes(search)) return false;
  if (filters.price !== "all" && part.price > Number(filters.price)) return false;
  if (filters.socket !== "all" && part.specs.socket !== filters.socket) return false;
  if (filters.ramType !== "all" && part.specs.ramType !== filters.ramType) return false;
  return filters.formFactor === "all" || part.specs.formFactor === filters.formFactor;
}

function renderComponents() {
  const filtered = components.filter((part) => part.category === selectedCategory && partMatchesFilters(part));
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "part" : "parts"}`;
  componentList.innerHTML = filtered.length
    ? filtered.map(renderComponentCard).join("")
    : `<div class="empty-state">No ${escapeHtml(categories.find((category) => category.id === selectedCategory).label.toLowerCase())} parts match the current filters.</div>`;
}

function renderComponentCard(part) {
  const specs = Object.entries(part.specs)
    .slice(0, 4)
    .map(([key, value]) => `<div class="spec-row"><span>${formatSpecKey(key)}</span><strong>${escapeHtml(value)}</strong></div>`)
    .join("");

  return `
    <article class="component-card" draggable="true" data-id="${part.id}" tabindex="0" aria-label="${escapeHtml(part.name)}">
      <div class="card-top">
        <h3>${escapeHtml(part.name)}</h3>
        <span class="price">${formatCurrency(part.price, partCurrency(part))}</span>
      </div>
      <span class="badge">${categories.find((category) => category.id === part.category).label}</span>
      <div class="specs">${specs}</div>
    </article>
  `;
}

function renderSlots() {
  slotsEl.innerHTML = requiredSlots
    .map((slot) => {
      const value = build[slot];
      const parts = multiSlots.has(slot) ? value : value ? [value] : [];
      const title = categories.find((category) => category.id === slot).label;
      const content = parts.length
        ? `<div class="slot-items">
            ${parts
              .map(
                (part, index) => `<div class="slot-item">
                  <div class="slot-part">
                    <strong>${escapeHtml(part.name)}</strong>
                    <span class="slot-empty">${escapeHtml(slotSummary(part))}</span>
                  </div>
                  <button class="remove-part" type="button" data-remove="${slot}" data-index="${index}">Remove</button>
                </div>`
              )
              .join("")}
          </div>
          ${multiSlots.has(slot) ? `<span class="slot-empty">${slotCapacitySummary(slot)}</span>` : ""}`
        : `<span class="slot-empty">Drop a ${title.toLowerCase()} here</span>`;

      return `
        <section class="slot" data-slot="${slot}">
          <div class="slot-top">
            <span class="slot-title">${title}</span>
            ${parts.length ? `<span class="badge">${parts.length} selected</span>` : '<span class="badge">Empty</span>'}
          </div>
          ${content}
        </section>
      `;
    })
    .join("");
}

function selectedParts() {
  return Object.entries(build).flatMap(([, value]) => (Array.isArray(value) ? value : value ? [value] : []));
}

function getSlotParts(slot) {
  const value = build[slot];
  return multiSlots.has(slot) ? value : value ? [value] : [];
}

function missingSlots() {
  return requiredSlots.filter((slot) => getSlotParts(slot).length === 0);
}

function slotCapacitySummary(slot) {
  if (slot === "ram") {
    const modules = build.ram.reduce((sum, part) => sum + (part.specs.modules ?? 2), 0);
    const boardSlots = build.motherboard?.specs.formFactor === "Mini-ITX" ? 2 : 4;
    return `${modules}/${boardSlots} DIMM slots planned`;
  }

  if (slot === "storage") {
    const m2 = build.storage.filter((part) => part.specs.interface === "M.2").length;
    const sata = build.storage.filter((part) => part.specs.interface === "SATA").length;
    const maxM2 = build.motherboard?.specs.m2 ?? 4;
    const maxSata = build.motherboard?.specs.sata ?? 4;
    return `${m2}/${maxM2} M.2 and ${sata}/${maxSata} SATA used`;
  }

  return "";
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
  return selectedParts().reduce((sum, part) => sum + (part?.wattage ?? 0), 50);
}

function estimatePrice() {
  return selectedParts().reduce((sum, part) => sum + (part?.price ?? 0), 0);
}

function serializeBuild() {
  return Object.fromEntries(
    requiredSlots.map((slot) => {
      const value = build[slot];
      return [slot, multiSlots.has(slot) ? value.map((part) => part.id) : value?.id ?? null];
    })
  );
}

function hydrateBuild(serialized) {
  requiredSlots.forEach((slot) => {
    const value = serialized?.[slot];
    if (multiSlots.has(slot)) {
      build[slot] = Array.isArray(value) ? value.map(findComponent).filter(Boolean) : [];
    } else {
      build[slot] = value ? findComponent(value) ?? null : null;
    }
  });
}

function applyPreset(presetId) {
  const preset = buildPresets.find((item) => item.id === presetId);
  if (!preset) return;
  hydrateBuild(preset.build);
  activePresetId = preset.id;
  buildNameInput.value = preset.name;
  renderAll();
  updateModel(build);
}

function readSavedBuilds() {
  try {
    const parsed = JSON.parse(localStorage.getItem(savedBuildsKey) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSavedBuilds(savedBuilds) {
  localStorage.setItem(savedBuildsKey, JSON.stringify(savedBuilds));
}

function createSavedBuildId() {
  return crypto.randomUUID?.() ?? `build-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function evaluateCompatibility() {
  const notes = [];
  const errors = [];
  const warnings = [];
  const missing = missingSlots();
  const selectedCount = requiredSlots.length - missing.length;
  const board = build.motherboard;
  const cpu = build.cpu;
  const ramParts = build.ram;
  const pcCase = build.case;
  const gpu = build.gpu;
  const storageParts = build.storage;
  const psu = build.psu;
  const cooler = build.cooler;
  const estimated = estimateWattage();

  if (board && cpu) {
    if (board.specs.socket !== cpu.specs.socket) errors.push(`CPU socket ${cpu.specs.socket} does not match motherboard socket ${board.specs.socket}.`);
    else {
      notes.push(`Processor and motherboard both use ${cpu.specs.socket}.`);
      if (board.specs.generation && cpu.specs.generation && !board.specs.generation.includes(cpu.specs.generation.split(" ")[0])) {
        warnings.push(`${cpu.name} may need a BIOS update on ${board.name}; confirm CPU support before buying.`);
      }
    }
  }

  if (board && ramParts.length) {
    const totalModules = ramParts.reduce((sum, part) => sum + (part.specs.modules ?? 2), 0);
    const boardSlots = board.specs.formFactor === "Mini-ITX" ? 2 : 4;
    const ramTypes = new Set(ramParts.map((part) => part.specs.ramType));

    if (ramTypes.size > 1) errors.push("Mixed memory generations are not supported in one build.");
    if ([...ramTypes].some((type) => type !== board.specs.ramType)) errors.push(`All selected memory must match the motherboard type: ${board.specs.ramType}.`);
    else notes.push(`${board.specs.ramType} memory matches the motherboard.`);

    if (totalModules > boardSlots) {
      errors.push(`Selected RAM uses ${totalModules} DIMM slots, but ${board.name} has about ${boardSlots}.`);
    } else {
      notes.push(`RAM uses ${totalModules}/${boardSlots} DIMM slots.`);
    }

    if (ramParts.length > 1) {
      warnings.push("Mixing multiple RAM kits can be unstable even when specs match; a single matched kit is preferred.");
    }

    ramParts.forEach((ram) => {
      if (ram.specs.speedMt && board.specs.maxRamSpeed && ram.specs.speedMt > board.specs.maxRamSpeed) {
        warnings.push(`${ram.name} is rated for ${ram.specs.speedMt} MT/s, above this board's typical ${board.specs.maxRamSpeed} MT/s target. It may downclock or need tuning.`);
      }
    });
  } else if (!ramParts.length && (board || cpu)) {
    warnings.push("Add at least one RAM kit to complete memory compatibility checks.");
  }

  if (ramParts.length) {
    const totalMemory = ramParts.reduce((sum, part) => sum + (parseNumber(part.specs.capacity) ?? 0), 0);
    if (totalMemory) notes.push(`Total memory capacity is ${totalMemory} GB.`);
  }

  if (pcCase && board) {
    const order = { "Mini-ITX": 0, "mATX": 1, ATX: 2 };
    if (order[board.specs.formFactor] > order[pcCase.specs.formFactor]) errors.push(`${board.specs.formFactor} motherboard is too large for the ${pcCase.specs.formFactor} case.`);
    else notes.push(`${board.specs.formFactor} motherboard fits inside the case.`);
  }

  if (pcCase && gpu) {
    if (gpu.specs.length > pcCase.specs.maxGpu) errors.push(`${gpu.name} is ${gpu.specs.length} mm, longer than the case limit of ${pcCase.specs.maxGpu} mm.`);
    else notes.push(`GPU length fits with ${pcCase.specs.maxGpu - gpu.specs.length} mm to spare.`);

    if (gpu.specs.slots > pcCase.specs.maxGpuSlots) {
      errors.push(`${gpu.name} needs ${gpu.specs.slots} expansion slots, but this case layout supports about ${pcCase.specs.maxGpuSlots}.`);
    }
  }

  if (board && storageParts.length) {
    const storageErrors = [];
    const m2Count = storageParts.filter((part) => part.specs.interface === "M.2").length;
    const sataCount = storageParts.filter((part) => part.specs.interface === "SATA").length;

    if (m2Count > board.specs.m2) storageErrors.push(`Selected storage needs ${m2Count} M.2 slots, but ${board.name} has ${board.specs.m2}.`);
    if (sataCount > board.specs.sata) storageErrors.push(`Selected storage needs ${sataCount} SATA ports, but ${board.name} has ${board.specs.sata}.`);
    errors.push(...storageErrors);
    storageParts.forEach((storage) => {
      if (storage.specs.interface === "M.2" && storage.specs.pcieGeneration >= 5 && !board.specs.pcie5Storage) {
        warnings.push(`${storage.name} is a PCIe 5.0 SSD, but ${board.name} may run it at PCIe 4.0 speeds.`);
      }
    });
    if (!storageErrors.length) notes.push(`Storage uses ${m2Count}/${board.specs.m2} M.2 and ${sataCount}/${board.specs.sata} SATA connections.`);
  } else if (!storageParts.length && board) {
    warnings.push("Add at least one storage drive to complete the build.");
  }

  if (pcCase && cooler?.specs.radiator > pcCase.specs.radiator) {
    errors.push(`${cooler.name} needs a ${cooler.specs.radiator} mm mount, but the case supports ${pcCase.specs.radiator} mm.`);
  } else if (pcCase && cooler) {
    notes.push(`${cooler.name} fits the cooling layout.`);
  }

  if (pcCase && cooler?.specs.style === "Air" && cooler.specs.height > pcCase.specs.maxAirCoolerHeight) {
    errors.push(`${cooler.name} is ${cooler.specs.height} mm tall, above this case's ${pcCase.specs.maxAirCoolerHeight} mm air cooler clearance.`);
  }

  if (cpu && cooler) {
    if (!cooler.specs.supportedSockets.includes(cpu.specs.socket)) {
      errors.push(`${cooler.name} does not list support for ${cpu.specs.socket}.`);
    } else {
      notes.push(`${cooler.name} supports the ${cpu.specs.socket} socket.`);
    }

    if (cooler.specs.coolingCapacity < cpu.wattage) {
      errors.push(`${cooler.name} is rated for about ${cooler.specs.coolingCapacity} W cooling, below ${cpu.name}'s ${cpu.wattage} W draw.`);
    } else if (cooler.specs.coolingCapacity < cpu.wattage * 1.35) {
      warnings.push(`${cooler.name} can cool ${cpu.name}, but there is limited thermal headroom for boost or quiet operation.`);
    } else {
      notes.push(`${cooler.name} has comfortable thermal headroom.`);
    }
  }

  if (board && gpu) {
    if (gpu.specs.pcieGeneration >= 5 && !board.specs.pcie5Gpu) {
      warnings.push(`${gpu.name} is PCIe ${gpu.specs.pcieGeneration}.0; ${board.name} may run it at an older PCIe mode. It should still work, but bandwidth can be lower.`);
    } else {
      notes.push(`Graphics card PCIe support is suitable for the motherboard.`);
    }
  }

  if (psu) {
    const recommended = Math.ceil(estimated * 1.35);
    if (psu.specs.watts < recommended) errors.push(`${psu.name} is below the recommended ${recommended} W for this build.`);
    else notes.push(`${psu.specs.watts} W power supply has enough headroom.`);

    if (gpu?.specs.connector === "12V-2x6" && psu.specs.connector !== "12V-2x6") {
      warnings.push(`${gpu.name} is best paired with an ATX 3.1 PSU with a native 12V-2x6 cable.`);
    } else if (gpu && psu.specs.connector === "12V-2x6") {
      notes.push(`${psu.name} has modern GPU cabling support.`);
    }
  } else if (estimated > 50) {
    warnings.push("Add a power supply to validate power headroom.");
  }

  if (ramParts.some((ram) => ram.name.includes("CUDIMM")) && board && !["Z890", "B860", "H810"].includes(board.specs.chipset)) {
    warnings.push("CUDIMM memory works best on newer Intel 800-series boards; confirm BIOS support before buying.");
  }

  if (selectedCount < requiredSlots.length) warnings.push(`${requiredSlots.length - selectedCount} required component slots still empty.`);

  return { notes, errors, warnings, estimated, missing };
}

function renderStatus() {
  const compatibility = evaluateCompatibility();
  const { notes, errors, warnings, estimated } = compatibility;
  wattageEl.textContent = `${estimated} W`;
  totalPriceEl.textContent = buildPriceLabel();
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

  compatList.innerHTML = [...errors, ...warnings, ...notes].slice(0, 8).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  renderSummary(compatibility);
}

function renderSummary(compatibility) {
  const { errors, warnings, missing } = compatibility;
  const price = estimatePrice();
  const wattage = estimateWattage();
  const partCount = selectedParts().length;
  const statusClass = errors.length ? "bad" : warnings.length ? "warn" : "ok";

  summaryStatus.className = `summary-status ${statusClass}`;
  summaryStatus.textContent = errors.length ? "Needs fixes" : warnings.length ? "Review" : "Ready";

  summaryMetrics.innerHTML = [
    ["Total", buildPriceLabel()],
    ["Power", `${wattage} W`],
    ["Parts", `${partCount}`]
  ]
    .map(([label, value]) => `<div class="summary-metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  summaryParts.innerHTML = requiredSlots
    .map((slot) => {
      const title = categories.find((category) => category.id === slot).label;
      const names = getSlotParts(slot).map((part) => part.name);
      return `<div class="summary-part"><span>${title}</span><strong>${names.length ? escapeHtml(names.join(" + ")) : "Missing"}</strong></div>`;
    })
    .join("");

  const reviewItems = [
    ...errors.map((text) => ({ type: "error", text })),
    ...warnings.filter((text) => !text.includes("required component slots")).map((text) => ({ type: "warning", text })),
    ...missing.map((slot) => ({ type: "missing", text: `Missing ${categories.find((category) => category.id === slot).label.toLowerCase()}.` }))
  ];

  summaryReview.innerHTML = reviewItems.length
    ? reviewItems.slice(0, 10).map((item) => `<li class="${item.type}">${escapeHtml(item.text)}</li>`).join("")
    : `<li>All required parts are selected and no compatibility issues are currently detected.</li>`;
}

function renderSavedBuilds() {
  const savedBuilds = readSavedBuilds();
  savedCount.textContent = `${savedBuilds.length}`;

  savedBuildsEl.innerHTML = savedBuilds.length
    ? savedBuilds
        .map(
          (savedBuild) => `<article class="saved-build">
            <div class="saved-build-top">
              <div>
                <strong>${escapeHtml(savedBuild.name)}</strong>
                <div class="saved-build-meta">${savedBuild.priceLabel ?? formatCurrency(savedBuild.price)} · ${savedBuild.wattage} W · ${savedBuild.partCount} parts</div>
              </div>
              <span>${new Date(savedBuild.updatedAt).toLocaleDateString()}</span>
            </div>
            <div class="saved-build-actions">
              <button type="button" data-load-build="${savedBuild.id}">Load</button>
              <button type="button" data-delete-build="${savedBuild.id}">Delete</button>
            </div>
          </article>`
        )
        .join("")
    : `<div class="empty-state">No saved builds yet.</div>`;
}

function canDrop(part, slot) {
  return part.category === slot;
}

function setPart(partId, slot) {
  const part = findComponent(partId);
  if (!part || !canDrop(part, slot)) return;
  if (multiSlots.has(slot)) build[slot].push(part);
  else build[slot] = part;
  activePresetId = null;
  renderAll();
  updateModel(build);
}

function renderAll() {
  renderCategories();
  renderPresets();
  renderComponents();
  renderSlots();
  renderStatus();
  renderSavedBuilds();
}

categoryTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  renderAll();
});

presetGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-preset]");
  if (!button) return;
  applyPreset(button.dataset.preset);
});

componentFilters.addEventListener("input", () => {
  filters.search = searchInput.value;
  filters.price = priceFilter.value;
  filters.socket = socketFilter.value;
  filters.ramType = ramTypeFilter.value;
  filters.formFactor = formFactorFilter.value;
  renderComponents();
});

componentFilters.addEventListener("submit", (event) => {
  event.preventDefault();
});

clearFilters.addEventListener("click", () => {
  filters.search = "";
  filters.price = "all";
  filters.socket = "all";
  filters.ramType = "all";
  filters.formFactor = "all";
  componentFilters.reset();
  renderComponents();
});

saveBuildForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = selectedParts();
  if (!selected.length) return;

  const savedBuilds = readSavedBuilds();
  const name = buildNameInput.value.trim() || `Build ${savedBuilds.length + 1}`;
  const existingIndex = savedBuilds.findIndex((savedBuild) => savedBuild.name.toLowerCase() === name.toLowerCase());
  const existing = existingIndex >= 0 ? savedBuilds[existingIndex] : null;
  const savedBuild = {
    id: existing?.id ?? createSavedBuildId(),
    name,
    build: serializeBuild(),
    price: estimatePrice(),
    priceLabel: buildPriceLabel(),
    wattage: estimateWattage(),
    partCount: selected.length,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) savedBuilds.splice(existingIndex, 1, savedBuild);
  else savedBuilds.unshift(savedBuild);

  writeSavedBuilds(savedBuilds);
  buildNameInput.value = "";
  activePresetId = null;
  renderSavedBuilds();
});

savedBuildsEl.addEventListener("click", (event) => {
  const loadButton = event.target.closest("[data-load-build]");
  const deleteButton = event.target.closest("[data-delete-build]");
  if (!loadButton && !deleteButton) return;

  const savedBuilds = readSavedBuilds();

  if (loadButton) {
    const savedBuild = savedBuilds.find((item) => item.id === loadButton.dataset.loadBuild);
    if (!savedBuild) return;
    hydrateBuild(savedBuild.build);
    activePresetId = null;
    buildNameInput.value = savedBuild.name;
    renderAll();
    updateModel(build);
    return;
  }

  const nextBuilds = savedBuilds.filter((item) => item.id !== deleteButton.dataset.deleteBuild);
  writeSavedBuilds(nextBuilds);
  renderSavedBuilds();
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
  const slot = removeButton.dataset.remove;
  if (multiSlots.has(slot)) build[slot].splice(Number(removeButton.dataset.index), 1);
  else build[slot] = null;
  activePresetId = null;
  renderAll();
  updateModel(build);
});

document.querySelector("#resetBuild").addEventListener("click", () => {
  requiredSlots.forEach((slot) => {
    build[slot] = multiSlots.has(slot) ? [] : null;
  });
  activePresetId = null;
  buildNameInput.value = "";
  renderAll();
  updateModel(build);
});

const canvas = document.querySelector("#pcScene");
const scene = new THREE.Scene();
scene.background = new THREE.Color("#eef1f3");

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(4.6, 3.15, 5.2);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.55, 0);
controls.minDistance = 3.4;
controls.maxDistance = 11;

scene.add(new THREE.HemisphereLight("#ffffff", "#b8c1ca", 1.65));
const keyLight = new THREE.DirectionalLight("#ffffff", 1.75);
keyLight.position.set(3.8, 6.2, 4.5);
keyLight.castShadow = true;
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight("#dfe8ff", 0.75);
fillLight.position.set(-4, 3, 3);
scene.add(fillLight);

const modelRoot = new THREE.Group();
scene.add(modelRoot);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(4.8, 96),
  new THREE.MeshStandardMaterial({ color: "#d8dde1", roughness: 0.82, metalness: 0.03 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.5,
    metalness: 0.18,
    ...options
  });
}

function accentMaterial(color, intensity = 0.4) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: intensity,
    roughness: 0.34,
    metalness: 0.16
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

function cylinder(name, radius, depth, position, color, axis = "x", options = {}) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 36), material(color, options));
  mesh.name = name;
  mesh.position.set(...position);
  if (axis === "x") mesh.rotation.z = Math.PI / 2;
  if (axis === "z") mesh.rotation.x = Math.PI / 2;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  modelRoot.add(mesh);
  return mesh;
}

function panel(name, size, position, color = "#f1f3f4", options = {}) {
  return box(name, size, position, color, { roughness: 0.42, metalness: 0.34, ...options });
}

function screw(name, position, radius = 0.035, color = "#9aa3aa") {
  return cylinder(name, radius, 0.018, position, color, "x", { roughness: 0.28, metalness: 0.65 });
}

function fan(name, position, radius = 0.22, axis = "x", accent = "#20262d") {
  cylinder(`${name}-frame`, radius, 0.045, position, "#cfd6dc", axis, { roughness: 0.34, metalness: 0.28 });
  cylinder(`${name}-hub`, radius * 0.28, 0.07, position, accent, axis, { roughness: 0.4, metalness: 0.12 });

  for (let index = 0; index < 7; index += 1) {
    const blade = box(`${name}-blade-${index}`, [0.025, radius * 0.78, 0.018], position, accent, { roughness: 0.48, metalness: 0.08 });
    blade.rotation.x = axis === "z" ? Math.PI / 2 : 0;
    blade.rotation.z = axis === "x" ? Math.PI / 2 + index * ((Math.PI * 2) / 7) : index * ((Math.PI * 2) / 7);
    blade.rotation.y = axis === "z" ? index * ((Math.PI * 2) / 7) : 0.28;
  }
}

function vent(name, basePosition, rows, columns, spacingY, spacingZ, color = "#8f9aa3") {
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      cylinder(
        `${name}-${row}-${column}`,
        0.016,
        0.014,
        [basePosition[0], basePosition[1] + row * spacingY, basePosition[2] + column * spacingZ],
        color,
        "x",
        { roughness: 0.32, metalness: 0.5 }
      );
    }
  }
}

function accentBox(name, size, position, color, intensity = 0.4) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), accentMaterial(color, intensity));
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  modelRoot.add(mesh);
  return mesh;
}

function cable(name, start, end, color = "#111820", midpoints = []) {
  const points = [start, ...midpoints, end].map((point) => new THREE.Vector3(...point));
  const curve = new THREE.CatmullRomCurve3(points);
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, 0.018, 8), material(color, { roughness: 0.7, metalness: 0.04 }));
  mesh.name = name;
  mesh.castShadow = true;
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

  const selectedCaseColor = parts.case?.specs.color;
  const whiteCase = !selectedCaseColor || ["#f4f7f5", "#f5f7f9", "#eef4f8"].includes(selectedCaseColor);
  const caseColor = whiteCase ? "#f4f5f6" : selectedCaseColor;
  const trimColor = whiteCase ? "#d7dde2" : "#252d35";
  const caseHeight = parts.case?.specs.formFactor === "Mini-ITX" ? 2.55 : parts.case?.specs.formFactor === "mATX" ? 2.9 : 3.24;
  const caseWidth = parts.case?.specs.formFactor === "Mini-ITX" ? 2.12 : 2.72;
  const caseDepth = parts.case?.specs.formFactor === "Mini-ITX" ? 1.42 : 1.92;
  const caseCenterY = caseHeight / 2 + 0.05;
  const frontX = -caseWidth / 2;
  const sideX = caseWidth / 2;
  const rearZ = -caseDepth / 2;
  const frontZ = caseDepth / 2;

  panel("case-backplate", [caseWidth, caseHeight, 0.09], [0, caseCenterY, rearZ], "#e9edf0");
  panel("case-bottom", [caseWidth, 0.12, caseDepth], [0, 0.08, 0], caseColor);
  panel("case-top", [caseWidth, 0.12, caseDepth], [0, caseHeight + 0.08, 0], caseColor);
  panel("case-front-frame", [0.12, caseHeight, caseDepth], [frontX, caseCenterY, 0], caseColor);
  panel("case-left-rear-upright", [0.11, caseHeight, 0.1], [sideX, caseCenterY, rearZ + 0.05], trimColor);
  panel("case-left-front-upright", [0.11, caseHeight, 0.1], [sideX, caseCenterY, frontZ - 0.05], trimColor);
  panel("case-open-side-bottom-rail", [0.11, 0.1, caseDepth], [sideX, 0.22, 0], trimColor);
  panel("case-open-side-top-rail", [0.11, 0.1, caseDepth], [sideX, caseHeight + 0.02, 0], trimColor);
  panel("case-bottom-psu-shroud", [caseWidth * 0.9, 0.34, caseDepth * 0.88], [-0.08, 0.34, -0.02], "#dfe4e8");
  panel("case-inner-tray", [0.08, caseHeight * 0.72, caseDepth * 0.64], [0.08, 1.84, rearZ + 0.34], "#cfd6dc");

  const glassPanel = box("removed-glass-panel", [0.035, caseHeight * 0.92, caseDepth * 0.86], [sideX + 0.16, caseCenterY, 0.03], "#b9d7ee", {
    transparent: true,
    opacity: 0.18,
    roughness: 0.04,
    metalness: 0
  });
  glassPanel.rotation.z = -0.04;

  [
    [frontX + 0.06, caseHeight + 0.12, rearZ + 0.08],
    [frontX + 0.06, 0.19, rearZ + 0.08],
    [sideX + 0.02, caseHeight + 0.1, frontZ - 0.12],
    [sideX + 0.02, 0.2, frontZ - 0.12]
  ].forEach((position, index) => screw(`case-screw-${index}`, position));

  vent("front-intake-vent", [frontX - 0.01, 0.62, frontZ - 0.52], 9, 4, 0.12, 0.1, "#aab3ba");
  vent("psu-shroud-vent", [-0.78, 0.54, 0.32], 3, 8, 0.07, 0.07, "#9aa4ac");

  const bayCount = parts.case?.specs.formFactor === "Mini-ITX" ? 2 : 4;
  for (let index = 0; index < bayCount; index += 1) {
    const y = 1.6 + index * 0.32;
    panel(`front-drive-bay-${index}`, [0.62, 0.18, 0.45], [frontX + 0.34, y, frontZ - 0.34], "#e8ecef");
    panel(`front-drive-bay-slot-${index}`, [0.48, 0.035, 0.48], [frontX + 0.35, y + 0.02, frontZ - 0.33], "#9da8b0");
  }

  const frontFanCount = parts.case?.specs.formFactor === "Mini-ITX" ? 1 : parts.case?.specs.radiator >= 360 ? 3 : 2;
  for (let index = 0; index < frontFanCount; index += 1) {
    const y = 0.9 + index * 0.68;
    fan(`front-fan-${index}`, [frontX + 0.12, y, 0.24], 0.23, "x", "#1b2127");
  }
  fan("rear-exhaust-fan", [sideX - 0.02, caseHeight - 0.52, rearZ + 0.28], 0.2, "x", "#1c242b");

  const boardColor = parts.motherboard?.specs.color ?? "#53606a";
  panel("motherboard", [0.08, 2.18, 1.26], [0.18, 1.76, -0.55], boardColor, { roughness: 0.56, metalness: 0.12 });
  panel("motherboard-io", [0.11, 0.42, 0.3], [0.25, 2.62, -0.36], "#b8c0c7");
  panel("vrm-heatsink-top", [0.12, 0.15, 0.78], [0.28, 2.43, -0.2], "#aab2b9");
  panel("vrm-heatsink-left", [0.12, 0.55, 0.16], [0.28, 2.15, -0.48], "#a0a8af");
  panel("chipset-heatsink", [0.12, 0.34, 0.34], [0.28, 1.18, -0.38], "#87929a");
  panel("pcie-primary-slot", [0.1, 1.0, 0.06], [0.29, 1.16, -0.04], "#20272d");
  panel("pcie-secondary-slot", [0.09, 0.72, 0.045], [0.3, 0.83, -0.12], "#303941");
  for (let index = 0; index < 7; index += 1) {
    panel(`rear-expansion-slot-${index}`, [0.07, 0.045, 0.54], [sideX - 0.02, 0.82 + index * 0.13, rearZ + 0.38], "#d7dde2");
  }

  if (parts.cpu) {
    panel("cpu", [0.1, 0.45, 0.45], [0.28, 1.95, -0.22], parts.cpu.specs.color);
  } else {
    panel("cpu-empty", [0.09, 0.42, 0.42], [0.28, 1.95, -0.22], "#bec5cb");
  }

  if (parts.cooler) {
    if (parts.cooler.specs.style === "Liquid") {
      const fanCount = parts.cooler.specs.radiator >= 360 ? 3 : 2;
      panel("aio-radiator", [0.18, 0.58 * fanCount, 0.34], [frontX + 0.18, 1.34 + fanCount * 0.28, 0.0], parts.cooler.specs.color);
      for (let index = 0; index < fanCount; index += 1) {
        const y = 1.1 + index * 0.55;
        fan(`aio-fan-${index}`, [frontX + 0.29, y, 0.0], 0.19, "x", "#1f252b");
      }
      panel("pump", [0.24, 0.34, 0.34], [0.4, 1.95, -0.22], "#20252a");
      cable("aio-tube-a", [0.42, 2.04, -0.08], [frontX + 0.3, 1.72, 0.0], "#151b22", [[0.05, 2.2, 0.15]]);
      cable("aio-tube-b", [0.42, 1.9, -0.06], [frontX + 0.3, 1.48, 0.0], "#151b22", [[0.02, 2.03, 0.18]]);
    } else {
      panel("air-cooler", [0.38, 0.78, 0.56], [0.44, 2.05, -0.22], parts.cooler.specs.color);
      fan("cooler-fan", [0.64, 2.05, -0.22], 0.25, "x", "#1f252b");
      panel("cooler-fin-stack", [0.3, 0.64, 0.5], [0.29, 2.05, -0.22], "#aeb8c2", { metalness: 0.45, roughness: 0.32 });
    }
  } else {
    panel("stock-cooler-placeholder", [0.2, 0.32, 0.32], [0.4, 1.95, -0.22], "#d2d8dd");
    fan("stock-cooler-fan", [0.51, 1.95, -0.22], 0.15, "x", "#7b858d");
  }

  const ramModuleColors = parts.ram.flatMap((part) => Array.from({ length: part.specs.modules ?? 2 }, () => part.specs.color)).slice(0, 4);
  for (let index = 0; index < 4; index += 1) {
    const y = 1.43 + index * 0.12;
    panel(`ram-${index}`, [0.11, 0.78, 0.055], [0.39, y, 0.08], ramModuleColors[index] ?? "#b9c1c8");
    if (ramModuleColors[index]) accentBox(`ram-light-${index}`, [0.115, 0.66, 0.018], [0.46, y, 0.08], ramModuleColors[index], 0.22);
  }

  if (parts.gpu) {
    const gpuLength = Math.min(1.62, Math.max(1.08, parts.gpu.specs.length / 215));
    const gpuHeight = Math.min(0.38, 0.18 + parts.gpu.specs.slots * 0.07);
    panel("gpu-body", [gpuLength, gpuHeight, 0.54], [0.25, 1.12, 0.18], parts.gpu.specs.color, { roughness: 0.46, metalness: 0.18 });
    panel("gpu-backplate", [gpuLength, 0.04, 0.56], [0.25, 1.31, 0.18], "#2b333a");
    const fanCount = parts.gpu.specs.length > 310 ? 3 : 2;
    for (let index = 0; index < fanCount; index += 1) {
      const x = -0.18 + index * 0.42;
      fan(`gpu-fan-${index}`, [x, 1.1, 0.48], 0.15, "z", "#12161a");
    }
    accentBox("gpu-light-strip", [gpuLength * 0.76, 0.035, 0.04], [0.25, 1.32, -0.06], parts.gpu.specs.color, 0.28);
  } else {
    panel("gpu-slot", [1.2, 0.08, 0.1], [0.25, 1.1, 0.03], "#4a545e");
  }

  parts.storage.slice(0, 4).forEach((storage, index) => {
    const isM2 = storage.specs.interface === "M.2";
    const m2Position = [0.29, 1.32 + index * 0.2, -0.34];
    const sataPosition = [frontX + 0.38, 0.64 + index * 0.2, frontZ - 0.34];
    panel(`storage-${index}`, isM2 ? [0.08, 0.58, 0.12] : [0.56, 0.16, 0.46], isM2 ? m2Position : sataPosition, storage.specs.color);
    if (!isM2) panel(`drive-tray-${index}`, [0.64, 0.055, 0.52], [sataPosition[0], sataPosition[1] - 0.1, sataPosition[2]], "#c2c9cf");
  });

  if (parts.psu) {
    panel("psu", [1.0, 0.42, 0.78], [-0.45, 0.38, -0.1], parts.psu.specs.color);
    fan("psu-fan", [-0.15, 0.38, 0.33], 0.2, "z", "#151a1f");
    cable("cpu-power-cable", [-0.32, 0.55, -0.34], [0.25, 2.42, -0.42], "#1f252b", [[-0.62, 1.5, -0.6], [-0.2, 2.35, -0.5]]);
    cable("board-power-cable-a", [-0.22, 0.55, -0.05], [0.43, 1.7, 0.05], "#f6f8f9", [[-0.55, 1.25, 0.2], [0.0, 1.66, 0.18]]);
    cable("board-power-cable-b", [-0.16, 0.55, 0.0], [0.43, 1.62, 0.08], "#262c31", [[-0.48, 1.18, 0.26], [0.05, 1.58, 0.23]]);
    if (parts.gpu) cable("gpu-power-cable", [-0.1, 0.58, -0.18], [0.34, 1.26, 0.38], "#20262c", [[-0.42, 0.98, 0.1], [0.12, 1.3, 0.44]]);
    if (parts.storage.some((storage) => storage.specs.interface === "SATA")) cable("sata-power-cable", [-0.42, 0.58, 0.22], [frontX + 0.38, 0.76, frontZ - 0.34], "#1e242a", [[-0.88, 0.7, 0.45]]);
  } else {
    panel("psu-placeholder", [1.0, 0.42, 0.78], [-0.45, 0.38, -0.1], "#d6dde2");
    fan("psu-placeholder-fan", [-0.15, 0.38, 0.33], 0.2, "z", "#6a737b");
  }

  cable("front-panel-cable", [frontX + 0.3, 0.75, frontZ - 0.2], [0.3, 1.0, -0.1], "#30363c", [[frontX + 0.58, 0.52, 0.25]]);
  cable("usb-cable", [frontX + 0.28, 2.48, frontZ - 0.24], [0.42, 1.48, 0.12], "#f1f3f4", [[frontX + 0.62, 2.25, 0.28], [0.2, 1.85, 0.24]]);
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
  camera.position.set(4.6, 3.15, 5.2);
  controls.target.set(0, 1.55, 0);
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
