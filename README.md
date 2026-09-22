# Desktop Assembly Emulator

A static browser app for assembling a desktop computer from categorized components.

## Run

From this folder:

```sh
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173/
```

The app loads Three.js from a CDN, so the 3D preview needs internet access.

## Features

- 63-part component catalog grouped by case, motherboard, processor, RAM, GPU, storage, PSU, and cooler
- 2024-current desktop platforms, including AM5 Ryzen 9000/9000X3D, LGA1851 Core Ultra 200S/200S Plus, RTX 50-series, Radeon RX 9000-series, PCIe 5.0 SSDs, and ATX 3.1 PSUs
- Search and filters for release year, price, socket, memory type, form factor, and power class
- Drag-and-drop assembly slots
- Keyboard fallback: focus a component card and press Enter to place it
- Compatibility checks for CPU socket, RAM type, form factor, GPU length, storage interface, radiator support, PSU headroom, RTX 50-series cabling guidance, and CUDIMM motherboard guidance
- Estimated wattage
- Rotatable 3D desktop model with OrbitControls and quick rotate buttons
