"""Build deterministic manual-install and complete-source release ZIPs."""

from pathlib import Path
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ROOT_FILES = {
    "README.md", "CHANGELOG.md", "hacs.json", "package.json", "package-lock.json",
    "pyproject.toml", "requirements-test.txt", "SHA256SUMS.txt", ".gitignore",
}
DIRECTORIES = {"custom_components", "docs", "tests", "scripts", ".github"}
EXCLUDED = {"__pycache__", ".pytest_cache", "node_modules", ".git", ".venv", "dist"}
EXTENSIONS = {".py", ".js", ".cjs", ".json", ".toml", ".txt", ".md", ".yml", ".yaml"}


def files():
    return sorted(
        p for p in ROOT.rglob("*")
        if p.is_file()
        and not set(p.relative_to(ROOT).parts) & EXCLUDED
        and (
            p.relative_to(ROOT).as_posix() in ROOT_FILES
            or (p.relative_to(ROOT).parts[0] in DIRECTORIES and p.suffix in EXTENSIONS)
        )
    )


def archive(path, paths):
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for p in paths:
            entry = zipfile.ZipInfo(p.relative_to(ROOT).as_posix(), (2026, 11, 10, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.external_attr = 0o644 << 16
            z.writestr(entry, p.read_bytes())
    with zipfile.ZipFile(path) as z:
        assert z.testzip() is None


def main():
    version = json.loads((ROOT / "custom_components/family_access_manager/manifest.json").read_text())["version"]
    all_files = files()
    checksums = "\n".join(
        f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(ROOT).as_posix()}"
        for p in all_files if p.name != "SHA256SUMS.txt"
    ) + "\n"
    (ROOT / "SHA256SUMS.txt").write_text(checksums)
    all_files = files()
    output = ROOT / "dist"
    output.mkdir(exist_ok=True)
    complete = output / f"Family_Access_Manager_{version}_Prototyp.zip"
    install = output / "family_access_manager.zip"
    archive(complete, all_files)
    archive(install, [p for p in all_files if p.relative_to(ROOT).parts[0] == "custom_components" or p.relative_to(ROOT).as_posix() in {"README.md", "docs/LOKAL_CLOUD_TEST.md", "docs/TESTERGEBNISSE.md"}])
    (output / "SHA256SUMS.txt").write_text("\n".join(f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.name}" for p in [install, complete]) + "\n")
    print(json.dumps({"version": version, "source_files": len(all_files), "assets": [p.name for p in [install, complete, output / "SHA256SUMS.txt"]]}))


if __name__ == "__main__":
    main()
