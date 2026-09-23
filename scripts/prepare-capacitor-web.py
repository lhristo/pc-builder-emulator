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


def main():
    if WEB_DIR.exists():
        shutil.rmtree(WEB_DIR)
    WEB_DIR.mkdir()

    for asset_path in ASSET_PATHS:
        copy_asset(asset_path)

    (WEB_DIR / ".nojekyll").write_text("", encoding="utf-8")
    print(f"Prepared {WEB_DIR.relative_to(ROOT)} with {len(ASSET_PATHS)} app assets.")


if __name__ == "__main__":
    main()
