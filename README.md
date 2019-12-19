# blog-reveal-template.nuxt

> Blog + Reveal-md template

## Installation

This template is powered by `yarn` and [yargs](https://github.com/yargs/yargs) CLI. It might not be compatible with NPM due to [Nuxt-ts bug](https://github.com/nuxt/typescript/issues/145).

```
git clone https://github.com/patarapolw/blog-reveal-template.nuxt.git
cd blog-reveal-template.nuxt
yarn
yarn link
```

Then, in the place you want to use this template,

```
yarn link blog-reveal
```

Then, add `blog-reveal .` to your `package.json`.

```json
"blog": "blog-reveal ."
```

Make sure you have required files.

```
media/
posts/
slides/
config.yaml
```

- Run `blog-reveal PATH_TO_ROOT` to spin up a development server, or `blog-reveal [cmd] PATH_TO_ROOT` to pass `[cmd]` to `nuxt-ts`.

```
blog-reveal [cmd] <root>

Start up Nuxt-ts server

Positionals:
  cmd   Command to pass to Nuxt-ts via Yarn                     [default: "dev"]
  root  Root folder to scan (Must have config.yaml and folders)

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```
