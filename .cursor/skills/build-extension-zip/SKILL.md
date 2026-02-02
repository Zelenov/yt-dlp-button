---
name: build-extension-zip
description: Creates a .zip package of a browser extension ready for Chrome Web Store or Firefox Add-ons. Use when the user asks to build, package, or zip the extension for release, or to create a publishable extension archive.
---

# Build extension zip for release

## Goal

Produce a single `.zip` file whose contents are the extension’s files **at the root** of the archive (e.g. `manifest.json` at top level). Archive paths **must use forward slashes** so both Chrome and Firefox store validators accept the file.

## Inputs

- **Extension root**: Folder that contains `manifest.json` (e.g. `src/`). Confirm from project layout or manifest location.
- **Output zip**: Repo root or parent of extension root. **Filename must include the extension version as a suffix:** `<base>-<version>.zip` (e.g. `yt-dlp-button-0.4.0.zip`). Use the version from `release.md` or `manifest.json` after syncing (see steps).
- **Optional**: If the project has a `release.md` whose first line is `# VERSION`, set `manifest.json`’s `version` to that value before zipping so the packaged version matches the release.

## Steps

### 1. Resolve version and optional manifest sync

- **Version**: From `release.md` first line `# VERSION` (e.g. `# 0.4.0`), or from `manifest.json` if no `release.md`. Use this version in the output zip filename.
- **Optional sync**: If `release.md` exists and its first line is `# VERSION`, update `manifest.json` so `version` equals that value (e.g. with `jq` or an in-place edit). Skip if there is no `release.md` or the user does not want the manifest changed.

### 2. Build the zip

- **Output filename**: Use `<base>-<version>.zip` (e.g. `yt-dlp-button-0.4.0.zip`). Version comes from step 1.
- **Contents**: All files under the extension root, with paths inside the zip relative to that root (no `src/` prefix inside the archive).
- **Path separator**: Entries in the zip **must** use forward slashes (e.g. `balloon/balloon.js`). Backslashes cause Firefox Add-ons to reject the file.
- **Exclude**: Ignore `.git` and `*.git*` if present under the extension root.

### 3. Platform-specific commands

**Linux / macOS / Git Bash**

```bash
cd <extensionRoot>
zip -r ../<outputName>.zip . -x "*.git*"
```

Example: extension root `src`, version `0.4.0`, output `yt-dlp-button-0.4.0.zip` in repo root:

```bash
cd src
zip -r ../yt-dlp-button-0.4.0.zip . -x "*.git*"
```

**Windows PowerShell**

`Compress-Archive` uses backslashes in entry names; Firefox will reject that. Use `ZipArchive` and normalize entry names to forward slashes:

```powershell
$srcDir = "<absolute-path-to-extension-root>"
$zipPath = "<absolute-path-to-output>-<version>.zip"
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
Get-ChildItem -Path $srcDir -Recurse -File | ForEach-Object {
  $relative = $_.FullName.Substring($srcDir.Length + 1)
  $entryName = $relative.Replace('\', '/')
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $entryName, 'Optimal') | Out-Null
}
$zip.Dispose()
```

Replace `<absolute-path-to-extension-root>`, `<absolute-path-to-output>`, and `<version>` with real values (e.g. `c:\Work\my\ytytdlp\src`, `c:\Work\my\ytytdlp\yt-dlp-button`, `0.4.0` → `yt-dlp-button-0.4.0.zip`).

### 4. Verify (optional)

- Open the zip and confirm `manifest.json` is at the root.
- Confirm entry names use forward slashes (e.g. `balloon/balloon.js`, not `balloon\balloon.js`).

## Output

- Path to the created zip.
- Short note: user can upload it to Chrome Web Store or Firefox Add-ons (addons.mozilla.org) as appropriate.

## Firefox Add-ons (AMO) notes

- For **Firefox**, the manifest should include `browser_specific_settings.gecko.data_collection_permissions` (required for new add-ons from Nov 2025). Support for that key starts at Firefox 140 (desktop) and Firefox for Android 142, so `strict_min_version` must be at least those if the key is present.
- These manifest details are separate from building the zip; fix them in the project’s `manifest.json` before or after running this workflow.

## Reference

- For context and lessons learned from creating this skill (zip path issues, Firefox manifest and validation fixes), see [reference.md](reference.md).
