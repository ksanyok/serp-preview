# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-26

### Added
- `serp-preview` CLI for URLs or `--title`/`--description` text, `--mobile`, `--html` visual export, `--json`, `--strict`
- Pixel-width measurement with Arial glyph metrics for Latin text and calibrated estimates for Cyrillic, CJK, emoji and punctuation
- Word-boundary truncation with ellipsis for desktop (~600 px title, ~990 px description) and mobile limits
- Checks: missing, truncated, short, generic and all-caps titles; missing, truncated and short descriptions
- Library API (`serpPreview`, `previewUrl`, `textWidth`, `truncateToWidth`, `renderHtml`) and GitHub Action

[1.0.0]: https://github.com/ksanyok/serp-preview/releases/tag/v1.0.0
