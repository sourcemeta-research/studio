# Sourcemeta Studio

[![GitHub Release](https://img.shields.io/github/v/release/sourcemeta-research/studio)](https://github.com/sourcemeta-research/studio/releases)
[![CI](https://github.com/sourcemeta-research/studio/workflows/CI/badge.svg)](https://github.com/sourcemeta-research/studio/actions)

> A Visual Studio Code extension for working with [JSON Schema](https://json-schema.org/), powered by the [Sourcemeta JSON Schema CLI](https://github.com/sourcemeta/jsonschema).

Sourcemeta Studio brings professional JSON Schema tooling directly into your editor. It provides real-time linting, formatting, metaschema validation, and comprehensive error diagnostics with precise position tracking—all within a beautiful, integrated webview interface. Whether you're authoring schemas for APIs, validating data models, or maintaining schema repositories, Sourcemeta Studio ensures quality and consistency without leaving VS Code.

![Sourcemeta Studio Example](./assets/example.png)

## Features

Sourcemeta Studio leverages the full power of the Sourcemeta JSON Schema CLI to provide:

- **Real-time Linting** - Detect anti-patterns, validate references, and ensure best practices
- **Automatic Formatting** - Format schemas with consistent indentation and keyword ordering
- **Metaschema Validation** - Verify schemas are valid according to their declared metaschema
- **Precise Error Navigation** - Click on errors to jump directly to the problematic code
- **Schema Health** - Visual health indicators for your schemas
- **Inline Diagnostics** - See errors and warnings directly in the editor with VS Code's diagnostic system
- **YAML Support** - Full support for JSON Schema written in YAML
- **Better Auto-completion** - Autocompletion (IntelliSense) for JSON Schema files powered by the bundled Sourcemeta JSON Schema CLI.


> Do you want to level up your JSON Schema skills? Check out
> [learnjsonschema.com](https://www.learnjsonschema.com), our growing JSON
> Schema documentation website, our [JSON Schema for
> OpenAPI](https://www.sourcemeta.com/courses/jsonschema-for-openapi) video
> course, and our O'Reilly book [Unifying Business, Data, and Code: Designing
> Data Products with JSON
> Schema](https://www.oreilly.com/library/view/unifying-business-data/9781098144999/).


## Installation

You can install Sourcemeta Studio directly from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=sourcemeta.sourcemeta-studio).

Alternatively, you can open this link directly in Visual Studio Code by using the command palette (Ctrl+P or Cmd+P on macOS) and entering:

```
ext install sourcemeta.sourcemeta-studio
```


## Version Control

We aim to fully support _every_ version of JSON Schema and combinations between them.

| Dialect             | Support                                               |
|---------------------|-------------------------------------------------------|
| JSON Schema 2020-12 | **Full**                                              |
| JSON Schema 2019-09 | **Full**                                              |
| JSON Schema Draft 7 | **Full**                                              |
| JSON Schema Draft 6 | **Full**                                              |
| JSON Schema Draft 4 | **Full**                                              |
| JSON Schema Draft 3 | Partial (except `validate`, `test`, and `metaschema`) |
| JSON Schema Draft 2 | Partial (except `validate`, `test`, and `metaschema`) |
| JSON Schema Draft 1 | Partial (except `validate`, `test`, and `metaschema`) |
| JSON Schema Draft 0 | Partial (except `validate`, `test`, and `metaschema`) |

## Development

Please refer to [/vscode/README.markdown](./vscode//README.markdown)

## Contributing

We welcome contributions to Sourcemeta Studio! Please see our licensing terms in the [LICENSE](./LICENSE) file. Key points:

- You may review and audit the source code
- You may contribute improvements back to the project
- You may use the code for local development and testing

For production use, please use the official releases from the VS Code marketplace.

## Support

- **Issues**: [GitHub Issues](https://github.com/sourcemeta-research/studio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sourcemeta-research/studio/discussions)
- **Email**: hello@sourcemeta.com

## License

See [LICENSE](./LICENSE) for details.

## Acknowledgments

Sourcemeta Studio is powered by:

- [Sourcemeta JSON Schema CLI](https://github.com/sourcemeta/jsonschema) - The comprehensive JSON Schema toolkit
- [VS Code](https://code.visualstudio.com/) - The extensible code editor
- [React](https://react.dev/) - For building the webview UI
- [TypeScript](https://www.typescriptlang.org/) - For type-safe development
- [Tailwind CSS](https://tailwindcss.com/) - For beautiful, consistent styling
