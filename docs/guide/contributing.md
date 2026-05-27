# How to Contribute

Contributions are welcome. This project values specificity — if you open a PR, make it concrete.

## Development setup

```bash
git clone https://github.com/ryanda9910/crucible.git
cd crucible
pnpm install
```

Test the CLI locally:
```bash
pnpm dev          # runs tsx src/index.ts
```

Test scaffolding directly:
```bash
pnpm tsx src/index.ts /tmp/test-project
```

## Commit format

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

```
feat(cli): add vue framework option
fix(generator): handle empty target directory
docs(readme): update quick start example
chore(deps): bump vitepress to 1.6.0
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `revert`

Commitlint enforces this on every commit via Husky.

## What to contribute

**High value:**
- New framework template — see [Adding a Framework](/guide/adding-framework)
- New UI library — see [Adding a UI Library](/guide/adding-ui-library)
- Bug fix with a reproduction case
- GUARDRAILS entry — a failure pattern you found and documented

**Lower priority:**
- Refactoring without behavior change
- New features without a clear use case

## PR process

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Make changes + commit with conventional format
4. Open a PR against `main`
5. Fill in the PR template

PRs that add a framework must include:
- Template files in `templates/frameworks/{name}/`
- Framework entry in `src/index.ts`
- Documentation update in `docs/guide/frameworks.md`

PRs that add a UI library must include:
- `templates/ui-libs/{name}/_config.json`
- Overlay files where needed (providers, config)
- Documentation update in `docs/guide/ui-libraries.md`

## Reporting bugs

Include:
- CLI version: `npx create-crucible --version`
- Framework + UI lib selected
- Node.js version
- Steps to reproduce
