# Getting started

## Requirements

Node.js 18 or newer. No other dependencies.

## Install

```bash
# one-off run
npx github:ksanyok/serp-preview example.com

# global CLI
npm install -g github:ksanyok/serp-preview

# as a library in your project
npm install github:ksanyok/serp-preview
```

## First run

```bash
serp-preview example.com
```

The preview shows the URL line, the title (with `…` where it will be cut) and the description wrapped as in results, followed by the measured title width. Problems follow: `!` warnings mean text will be cut or chosen by Google, `i` notes are suggestions.

## Exit codes

| Code | Meaning |
|---|---|
| 0 | No errors (warnings allowed unless `--strict`) |
| 1 | Errors found (or warnings with `--strict`) |
| 2 | Bad arguments or the check could not run |

## More examples

**Test a title and description before publishing**

```bash
serp-preview --title "Blue Widgets for Small Workshops | Example" --description "Compare 40 blue widgets by size, price and durability." --url https://example.com/widgets
```

**Mobile limits**

```bash
serp-preview example.com/blog/post --mobile
```

**Save a visual preview**

```bash
serp-preview example.com --html preview.html
```

## Without installing anything

Use the [online SERP Preview](https://promopilot.link/en/tools/serp-preview.php?utm_source=github&utm_medium=repo&utm_campaign=tools&utm_content=serp-preview).
