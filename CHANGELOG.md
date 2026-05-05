# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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