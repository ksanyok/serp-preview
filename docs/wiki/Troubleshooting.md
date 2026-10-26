# Troubleshooting

## The title in results differs from my <title>

Google rewrote it. Common reasons: the title is too long, generic, repeated across pages or does not match the content. Fix those and the original title usually comes back.

## A fetched page shows an empty title

The title may be set by JavaScript. The tool reads server HTML, like Google's first pass. Pass the text with `--title` to preview it anyway.

## Shell quoting problems

Wrap titles in double quotes, and escape `$` and backticks in your shell.

## Still stuck?

Open an [issue](https://github.com/ksanyok/serp-preview/issues/new/choose) with the command, the output (`--json` if possible) and your Node.js version — or compare with the [online version](https://promopilot.link/en/tools/serp-preview.php?utm_source=github&utm_medium=repo&utm_campaign=tools&utm_content=serp-preview).
