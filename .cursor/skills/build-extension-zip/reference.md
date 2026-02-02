# Reference: context and lessons learned

This document records what was done when building and fixing the extension zip and Firefox Add-ons validation in this project, so the same issues can be avoided or fixed quickly next time.

---

## 1. Building the zip when CI is unavailable

When GitHub Actions were not available, the release workflow was replicated locally:

- Read the version from `release.md` (first line: `# VERSION`).
- Set `manifest.json`’s `version` to that value.
- Create a zip of the extension root (e.g. `src/`) with contents at the **root** of the archive (no `src/` prefix inside the zip).

---

## 2. Firefox: "Invalid file name in archive"

**Error:** `Invalid file name in archive: balloon\balloon-template.js`

**Cause:** On Windows, PowerShell’s `Compress-Archive` writes entry names with **backslashes**. Firefox Add-ons (addons.mozilla.org) require **forward slashes** in zip paths.

**Fix:** Do not use `Compress-Archive` for extension zips on Windows. Use .NET `ZipArchive` and set each entry’s name from the file’s relative path with backslashes replaced by forward slashes:

```powershell
$entryName = $relative.Replace('\', '/')
```

The skill’s Windows PowerShell block uses this approach.

---

## 3. Firefox: "data_collection_permissions" property is missing

**Error:** The `data_collection_permissions` property is missing.

**Cause:** From November 2025, new Firefox extensions must declare data collection in the manifest.

**Fix:** Under `browser_specific_settings.gecko`, add:

```json
"data_collection_permissions": {
  "required": ["none"],
  "optional": []
}
```

Use `["none"]` for required when the extension does not collect or transmit user data.

---

## 4. Firefox: Manifest key not supported by minimum version

**Error:**  
`"strict_min_version" requires Firefox 109, which was released before version 140 introduced support for "browser_specific_settings.gecko.data_collection_permissions".`  
Same idea for Firefox for Android and version 142.

**Cause:** `data_collection_permissions` is supported from Firefox 140 (desktop) and Firefox for Android 142. With `strict_min_version: "109.0"`, the validator complains that the key is not supported in that range.

**Fix:**

- Set `gecko.strict_min_version` to `"140.0"` (desktop).
- Add `gecko_android` with `strict_min_version": "142.0"` so the same key is valid on Android.

Result: the extension officially supports Firefox 140+ (desktop) and Firefox for Android 142+.

---

## 5. Firefox: Unsafe assignment to innerHTML

**Error:**  
`Unsafe assignment to innerHTML` in `sites/youtube/button/button.js` (line 21) and `balloon/balloon.js` (line 24).

**Cause:** The validator flags any assignment to `innerHTML` when the value is dynamic (e.g. from a variable), for security and performance.

**Fix:** Replace the pattern “create wrapper div → set innerHTML → take firstElementChild” with **DOMParser**:

```javascript
// Before (flagged)
var wrap = document.createElement('div');
wrap.innerHTML = html.trim();
var node = wrap.firstElementChild;

// After (accepted)
var doc = new DOMParser().parseFromString(html.trim(), 'text/html');
var node = doc.body.firstElementChild;
```

The HTML is still our own template (from extension code), not user input; DOMParser avoids the innerHTML sink so the validator is satisfied.

---

## 6. Archive filename: version as suffix

The release zip should include the extension version in the filename so each build is clearly identified, e.g. `yt-dlp-button-0.4.0.zip` instead of a fixed `yt-dlp-button.zip`. The skill enforces this by requiring the output zip name to be `<base>-<version>.zip`, with version taken from `release.md` or `manifest.json`.

---

## Summary checklist (Firefox AMO)

When packaging for Firefox Add-ons, ensure:

- [ ] Zip entry paths use **forward slashes** (not backslashes).
- [ ] Manifest includes `data_collection_permissions` under `gecko` (required/optional).
- [ ] `gecko.strict_min_version` ≥ 140 and `gecko_android.strict_min_version` ≥ 142 if using `data_collection_permissions`.
- [ ] No dynamic `innerHTML`; use `DOMParser().parseFromString(..., 'text/html')` and `doc.body.firstElementChild` for template HTML.
- [ ] Output zip name includes version: `<name>-<version>.zip`.
