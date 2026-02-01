---
name: create-release-version
description: Create or update a release version entry in release.md following the project's release-note structure (H2 Added, H2 Changed). Use when drafting a new version, cutting a release, or when the user asks to create or update release notes.
---

# Create release version

## Release note structure

Every version entry in **release.md** must include **at least one** of `## Added` or `## Changed`. Use **H2** for each section that has items; omit a section only if there is nothing to list (do not add empty sections).

```markdown
# X.Y.Z
## Added
- addition 1 (short description)
- addition 2 (short description)

## Changed
- change 1 (short description)
- change 2 (short description)
```

- **`# X.Y.Z`** — Version number as H1 (e.g. `# 0.1.0`).
- **`## Added`** — What is included/new in this release (features, capabilities). Short bullet descriptions. Omit only if nothing was added.
- **`## Changed`** — What was changed from before (behavior, API, UI). Short bullet descriptions. Omit only if nothing was changed.

## Instructions

1. **New version:** Add a new H1 block at the **top** of release.md (above existing versions). Use the next version number (e.g. 0.2.0).
2. **At least one section required:** Every version must have **at least one** of `## Added` or `## Changed`. Omit a section only when there are no items to list (no empty sections).
3. **Initial release (0.1.0):** Use **`## Added`** with a **single short line** (one bullet) describing the first version (e.g. "Initial release. Chrome extension that adds a yt-dlp button on YouTube to copy a ready-made command."). Do not list every feature; keep it to one sentence. Omit `## Changed`.
4. **Later releases (0.2.0+):** Use `## Added` and/or `## Changed` with bullet lists as needed.

## Example: initial release (0.1.0)

```markdown
# 0.1.0
## Added
- Initial release. Chrome extension that adds a yt-dlp button on YouTube watch pages to copy a ready-made command for the current video.
```

## File

- **release.md** — Single file at repo root. Prepend new version blocks; keep older versions below.
