from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
WEB_DIR = ROOT / "www"
ASSET_PATHS = [
    "index.html",
    "app.js",
    "styles.css",
    "data/feed-components.js",
]


def copy_asset(relative_path):
    source = ROOT / relative_path
    target = WEB_DIR / relative_path
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)


def write_text_asset(relative_path, content):
    target = WEB_DIR / relative_path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")


def ios_index_html(content):
    content = content.replace("Desktop Assembly Emulator", "PC Builder")
    content = content.replace("Assembly Emulator", "Component Builder")
    content = content.replace(
        """    <script type="importmap">
      {
        "imports": {
          "three": "https://esm.sh/three@0.164.1",
          "three/addons/": "https://esm.sh/three@0.164.1/examples/jsm/"
        }
      }
    </script>
""",
        ""
    )
    content = content.replace(
        """      <section class="workspace" aria-label="Assembly workspace">
        <div class="scene-panel">
          <canvas id="pcScene" aria-label="Rotatable computer model"></canvas>
          <div class="scene-tools">
            <button id="rotateLeft" class="icon-button" type="button" aria-label="Rotate left" title="Rotate left">⟲</button>
            <button id="rotateRight" class="icon-button" type="button" aria-label="Rotate right" title="Rotate right">⟳</button>
            <button id="fitView" class="icon-button" type="button" aria-label="Fit view" title="Fit view">⌂</button>
          </div>
        </div>

        <aside class="build-panel" aria-label="Build panel">
""",
        """      <section class="workspace" aria-label="Build workspace">
        <aside class="build-panel" aria-label="Build panel">
"""
    )
    content = content.replace("<p class=\"eyebrow\">Drop Zone</p>", "<p class=\"eyebrow\">Selected Parts</p>")
    content = content.replace(
        "Drag components from the left into matching slots.",
        "Tap a component on the left and it will be added to the correct slot."
    )
    return content


def ios_styles_css(content):
    return f"""{content}

/* iOS app layout: simplified touch-first builder without the 3D emulator. */
.shell {{
  grid-template-columns: minmax(340px, 460px) minmax(420px, 1fr);
}}

.component-card {{
  cursor: pointer;
  text-align: left;
}}

.component-card:active {{
  cursor: pointer;
}}

.component-card:focus-visible {{
  border-color: var(--blue);
  outline: 2px solid rgba(94, 167, 255, 0.35);
  outline-offset: 2px;
}}

.card-action-row {{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}}

.add-part {{
  min-height: 30px;
  border: 1px solid rgba(66, 214, 141, 0.48);
  border-radius: 8px;
  background: rgba(66, 214, 141, 0.1);
  color: var(--green);
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 760;
  padding: 0 10px;
  white-space: nowrap;
}}

.workspace {{
  display: block;
  height: 100vh;
  min-height: 0;
  overflow: hidden;
}}

.scene-panel,
.scene-tools,
#pcScene {{
  display: none !important;
}}

.slot {{
  border-style: solid;
}}

@media (max-width: 1120px) {{
  .shell {{
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }}

  .workspace {{
    height: auto;
    min-height: 0;
    overflow: visible;
  }}
}}
"""


def ios_app_js(content):
    content = content.replace('import * as THREE from "three";\n', "")
    content = content.replace('import { OrbitControls } from "three/addons/controls/OrbitControls.js";\n', "")
    content = content.replace("let draggedId = null;\n", "")
    content = content.replace(
        """    <article class="component-card" draggable="true" data-id="${part.id}" tabindex="0" aria-label="${escapeHtml(part.name)}">
      <div class="card-top">
        <h3>${escapeHtml(part.name)}</h3>
        <span class="price">${formatCurrency(part.price, partCurrency(part))}</span>
      </div>
      <span class="badge">${categories.find((category) => category.id === part.category).label}</span>
      <div class="specs">${specs}</div>
    </article>
""",
        """    <article class="component-card" data-id="${part.id}" tabindex="0" role="button" aria-label="Add ${escapeHtml(part.name)} to build">
      <div class="card-top">
        <h3>${escapeHtml(part.name)}</h3>
        <span class="price">${formatCurrency(part.price, partCurrency(part))}</span>
      </div>
      <div class="card-action-row">
        <span class="badge">${categories.find((category) => category.id === part.category).label}</span>
        <button class="add-part" type="button" data-add="${part.id}">Add</button>
      </div>
      <div class="specs">${specs}</div>
    </article>
"""
    )
    content = content.replace(
        ': `<span class="slot-empty">Drop a ${title.toLowerCase()} here</span>`;',
        ': `<span class="slot-empty">Tap a ${title.toLowerCase()} from the left to add it here</span>`;'
    )
    content = content.replace(
        """function setPart(partId, slot) {
  const part = findComponent(partId);
  if (!part || !canDrop(part, slot)) return;
  if (multiSlots.has(slot)) build[slot].push(part);
  else build[slot] = part;
  activePresetId = null;
  renderAll();
  updateModel(build);
}
""",
        """function setPart(partId, slot = null) {
  const part = findComponent(partId);
  const targetSlot = slot ?? part?.category;
  if (!part || !canDrop(part, targetSlot)) return;
  if (multiSlots.has(targetSlot)) build[targetSlot].push(part);
  else build[targetSlot] = part;
  activePresetId = null;
  renderAll();
}
"""
    )
    content = content.replace(
        """componentList.addEventListener("dragstart", (event) => {
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
""",
        """componentList.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const card = event.target.closest("[data-id]");
  const partId = addButton?.dataset.add ?? card?.dataset.id;
  if (!partId) return;
  setPart(partId);
});

componentList.addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-id]");
  if (!card || (event.key !== "Enter" && event.key !== " ")) return;
  event.preventDefault();
  const part = findComponent(card.dataset.id);
  setPart(part.id);
});
"""
    )
    content = content.replace("  updateModel(build);\n", "")
    start = content.index('const canvas = document.querySelector("#pcScene");')
    end = content.index("renderFilterOptions();", start)
    return content[:start] + content[end:]


def main():
    if WEB_DIR.exists():
        shutil.rmtree(WEB_DIR)
    WEB_DIR.mkdir()

    for asset_path in ASSET_PATHS:
        copy_asset(asset_path)

    write_text_asset("index.html", ios_index_html((ROOT / "index.html").read_text(encoding="utf-8")))
    write_text_asset("styles.css", ios_styles_css((ROOT / "styles.css").read_text(encoding="utf-8")))
    write_text_asset("app.js", ios_app_js((ROOT / "app.js").read_text(encoding="utf-8")))

    (WEB_DIR / ".nojekyll").write_text("", encoding="utf-8")
    print(f"Prepared {WEB_DIR.relative_to(ROOT)} with iOS-specific app assets.")


if __name__ == "__main__":
    main()
