# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.0] - 2026-08-21
### Added
- Inline `<code>` toolbar button with toggle (wrap/unwrap selection), styled `code`/`pre` blocks for light/dark themes (`src/editor.js`, `src/editor.css`, `src/lang`)
- Paste and DOMPurify sanitization now preserves `code` and `pre` tags
### Fixed
- Table edit toolbar now correctly updates rows/columns/headers — fixed `replaceChild` TypeError where `DOMPurify.sanitize` string was passed as Node (`src/editor.js:1324`), now uses sanitized DocumentFragment and syncs content

## [1.5.1] - 2026-08-16
### Fixed
- Stripped unwanted `data-*` attributes (e.g. `data-index-in-node`, `data-path-to-node`) from pasted AI chat HTML
- Added `DATA_ATTR: false` to all DOMPurify sanitize calls to prevent non-editor `data-*` attributes from surviving
- `_cleanHTML` now strips all non-editor `data-*` attributes from every element on each save cycle

## [1.1.0] - 2026-05-05
### Added
- Custom resize handles (8 draggable corners/edges) replacing native CSS resize
- Image alignment controls (left/center/right with text wrapping via float)
- Size presets in image bubble toolbar (small/medium/large)
- Width, height, and alignment fields in image insert/edit modal
- Color picker palette with 14 colors in a grid layout
### Fixed
- Orphaned image wrapper spans cleaned up automatically after deletion
- Image click detection when pointer-events:none is active
- Alignment preserved on save/load cycle

## [1.0.0] - 2026-05-02
### Added
- Initial version with semantic versioning support
- Build automation with GitHub Actions
- CDN and GitHub release support

[1.0.0]: https://github.com/yourusername/yeditor/compare/v0.0.0...v1.0.0