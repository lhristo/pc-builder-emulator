# Desktop Assembly Emulator

A static browser app for assembling a desktop computer from categorized components, checking compatibility, estimating price and wattage, and previewing the build in a rotatable 3D case.

Live app:

```text
https://lhristo.github.io/pc-builder-emulator/
```

## What It Does

- Lets users build a desktop PC by choosing case, motherboard, processor, RAM, graphics card, storage, power supply, and cooling
- Supports drag-and-drop assembly into build slots, plus keyboard placement with Enter
- Keeps the 3D desktop preview fixed while the component library and build panel scroll
- Automatically calculates the total build price and estimated wattage
- Checks component compatibility while the user builds
- Supports multiple RAM kits and multiple storage drives in one build
- Includes preset sample builds for gaming, office, creator workstation, budget, and high-end PCs
- Shows a build summary with selected parts, price, wattage, missing slots, and review items
- Saves, loads, overwrites, and deletes named builds in browser local storage
- Deploys automatically to GitHub Pages from the `main` branch

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

## Component Data

The app currently combines two component sources:

- 63 curated desktop components covering current 2024-2026 desktop platforms
- 1,735 imported supplier-feed products generated from XML

Imported supplier products by category:

| Category | Count |
| --- | ---: |
| Case | 203 |
| Motherboard | 401 |
| Processor | 189 |
| RAM | 153 |
| Graphics | 403 |
| Storage | 177 |
| Power | 128 |
| Cooling | 81 |

Covered curated platforms include AM5 Ryzen 9000/9000X3D, LGA1851 Core Ultra 200S/200S Plus, RTX 50-series, Radeon RX 9000-series, PCIe 5.0 SSDs, and ATX 3.1 PSUs.

## Compatibility Checks

The app checks:

- CPU socket and motherboard platform
- RAM generation, capacity, speed guidance, and DIMM slot usage
- Motherboard and case form-factor fit
- GPU length and expansion-slot clearance
- M.2 and SATA storage slot usage
- PCIe 5.0 GPU and SSD guidance
- Radiator support and air-cooler height clearance
- Cooler socket support and cooling capacity
- PSU headroom and modern GPU cabling
- CUDIMM motherboard guidance

Compatibility messages are guidance for planning. Users should still confirm final vendor QVL, BIOS support, and physical clearance before buying parts.

## Deployment

GitHub Pages deploys from `main` with GitHub Actions.

Production URL:

```text
https://lhristo.github.io/pc-builder-emulator/
```

Deployment files:

- `.github/workflows/pages.yml`
- `.nojekyll`

## Update Supplier Data

Regenerate the imported catalog from a supplier XML feed:

```sh
python3 scripts/convert-products-feed.py /path/to/AllProducts.xml data/feed-components.js
```

Then commit `data/feed-components.js` with the app.

## Notes

- Prices are displayed from the loaded catalog data and are meant for planning.
- If selected parts use mixed currencies, the total price displays `Mixed`.
- Saved builds stay in the current browser through local storage.
