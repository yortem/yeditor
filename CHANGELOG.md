# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.10.0] - 2026-11-26
### Added
- `maxHeight` option: the editor keeps growing with its content up to the given height and then scrolls internally (e.g. `maxHeight: 700`)
- `height`/`maxHeight` now also accept plain numbers (treated as pixels) as well as any CSS length (`'700px'`, `'70vh'`)
- Code blocks are now first-class writable blocks: the code button creates an empty code block when the caret is collapsed, multi-line selections become `<pre><code>` blocks (single-line selections stay inline `<code>`)
- `Enter` on an empty last line exits a code block (double-Enter), `Backspace` in an empty block removes it, and `Shift+Enter` keeps adding lines
- Smart paste: code from IDEs/chats, JSON payloads and rendered `<pre>` blocks is inserted byte-exact as `<pre><code>` instead of plain text
- Code blocks use a dark surface, light text and a monospace font stack in both themes; spell-check/autocorrect is disabled inside them
### Changed
- The code button now uses the clean `<>` icon, and the HTML source view moved out of the toolbar to a labeled `HTML` toggle in the status bar (next to the word count), so "view source" and "insert code" are no longer confused
### Fixed
- Code is always left-to-right (also in RTL editors): `direction: ltr` + `unicode-bidi: isolate` for `pre`/`code`, while the saved markup stays exactly `<pre><code>...</code></pre>`
- Typed text can no longer land outside the `<code>` element inside a `<pre>` (structure is normalized on input)
- `<br>` line breaks typed inside a code block are saved as real newlines, and `&nbsp;` is converted back to spaces so code stays copy-pasteable

## [1.9.1] - 2026-08-22
### Added
- Image caption support: new "כיתוב תמונה" field in image modal, saved as `<figure><figcaption>` and styled for light/dark themes
### Changed
- Image alignment picker redesigned as segmented control with short labels — ללא / שמאל / אמצע / ימין (imageAlignNone/Left/Center/Right) instead of repeating "יישור"

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