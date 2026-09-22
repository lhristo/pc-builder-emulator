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

## Update Supplier Data

Regenerate the imported catalog from a supplier XML feed:

```sh
python3 scripts/convert-products-feed.py /path/to/AllProducts.xml data/feed-components.js
```

Then commit `data/feed-components.js` with the app.

## Features

- 63-part component catalog grouped by case, motherboard, processor, RAM, GPU, storage, PSU, and cooler
- 2024-current desktop platforms, including AM5 Ryzen 9000/9000X3D, LGA1851 Core Ultra 200S/200S Plus, RTX 50-series, Radeon RX 9000-series, PCIe 5.0 SSDs, and ATX 3.1 PSUs
- Imported supplier feed catalog generated from XML, currently adding 1,735 extra CPU, motherboard, RAM, GPU, storage, case, PSU, and cooler products
- Search and filters for price, socket, memory type, and form factor
- Drag-and-drop assembly slots
- Multiple RAM kits and storage drives per build, with DIMM/M.2/SATA usage checks
- Build summary with selected parts, total price, estimated wattage, missing slots, and review items
- Save, load, overwrite, and delete named builds in browser local storage
- Keyboard fallback: focus a component card and press Enter to place it
- Compatibility checks for CPU socket/platform, RAM type and speed, form factor, GPU length and slot thickness, PCIe 5.0 GPU/storage guidance, storage interface, radiator support, air cooler clearance, cooler socket support, cooling capacity, PSU headroom, GPU cabling, and CUDIMM motherboard guidance
- Estimated wattage
- Rotatable 3D desktop model with OrbitControls, case size variation, front fans, board details, visible cooling, GPU scaling, storage bays, cabling, and quick rotate buttons
