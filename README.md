<!-- Last reviewed: 2026-03-14 -->

# testrepo

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

A minimal **Next.js 16** demo application built with the App Router, TypeScript, internationalization (i18n), and dark/light theme support. It serves as a clean, runnable starting point for exploring modern React and Next.js patterns.

---

## Table of Contents

- [Motivation](#motivation)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Internationalization](#internationalization)
- [Theming](#theming)
- [Contributing](#contributing)
- [See Also](#see-also)

---

## Motivation

Starting a new Next.js project often requires wiring up multiple concerns at once — routing, TypeScript configuration, i18n, and theme management. This repository provides a working reference implementation of all these patterns together, so you can explore how they interact or use it as a scaffold for a new project.

---

## Features

- **Next.js App Router** — file-based routing under `app/`
- **TypeScript** — full type safety across the codebase
- **Internationalization (i18n)** — English, Finnish, and Swedish via `react-i18next` with automatic browser language detection
- **Dark / Light theme** — system-preference detection with manual override, persisted in `localStorage`
- **Sticky navigation bar** — responsive nav with active-link highlighting and language switcher
- **Zero external UI library dependency** — all styling is done with inline styles and CSS variables

---

## Prerequisites

| Requirement | Version |
|---|---|
| [Node.js](https://nodejs.org/) | 20.9.0 or later |
| npm | Bundled with Node.js |

> **Platform note:** The development server and build steps work on macOS, Linux, and Windows. No additional platform-specific setup is required.

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Lukasedv/testrepo.git
   cd testrepo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Environment variables:** This project does not require any `.env` configuration. If you extend it, create a `.env.local` file in the project root (it is already listed in `.gitignore`).

---

## Usage

### Quickstart

After running `npm run dev`, you will see the Hello World page at [http://localhost:3000](http://localhost:3000):

```
Hello, World! 👋
Welcome to this Next.js demo.
```

### Changing the language

Use the language selector in the navigation bar to switch between **English (EN)**, **Finnish (FIN)**, and **Swedish (SWE)**. The selection is stored in `localStorage` under the key `i18nextLng` and persists across page reloads.

You can also force a specific locale by setting `i18nextLng` in your browser's `localStorage` before loading the page:

```js
// In the browser console:
localStorage.setItem('i18nextLng', 'fi');
location.reload();
```

### Switching themes

Click the **🌙 Dark** / **☀️ Light** button in the top-right corner of the nav bar. The preference is stored in `localStorage` under the key `theme`.

### Adding a new page

Create a new directory and `page.tsx` file under `app/`:

```bash
mkdir app/contact
```

```tsx
// app/contact/page.tsx
export default function Contact() {
  return <main><h1>Contact</h1></main>;
}
```

The route `/contact` is immediately available — no router configuration needed.

---

## Project Structure

```
testrepo/
├── app/
│   ├── about/
│   │   └── page.tsx          # /about route
│   ├── components/
│   │   ├── HtmlLangSync.tsx  # Syncs <html lang> attribute with active locale
│   │   ├── I18nProvider.tsx  # Initialises react-i18next for client components
│   │   ├── LanguageSwitcher.tsx # Standalone language-switcher widget
│   │   ├── NavBar.tsx        # Sticky navigation bar
│   │   └── ThemeProvider.tsx # Dark/light theme context and toggle
│   ├── locales/
│   │   ├── en.json           # English translations
│   │   ├── fi.json           # Finnish translations
│   │   └── sv.json           # Swedish translations
│   ├── constants.ts          # Shared layout constants (e.g. NAV_HEIGHT)
│   ├── globals.css           # Global CSS variables and base styles
│   ├── i18n.ts               # i18next initialisation and language list
│   ├── layout.tsx            # Root layout (metadata, providers)
│   └── page.tsx              # / route — Hello World page
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and npm scripts
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server at [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Build the application for production |
| `npm start` | Start the production server (run `build` first) |
| `npm run lint` | Run the Next.js ESLint linter |

---

## Internationalization

Translations live in `app/locales/<lang>.json`. To add a new language:

1. Create `app/locales/<lang>.json` with the required keys (copy `en.json` as a template).
2. Import the file and add it to the `resources` object in `app/i18n.ts`.
3. Add the language code to the `supportedLngs` array in the same file.
4. Add the display label to each locale file under `languageSwitcher.<lang>`.

The browser language detector (`i18next-browser-languagedetector`) automatically strips region subtags (e.g., `fi-FI` → `fi`), so regional locales resolve to the correct base language.

---

## Theming

CSS custom properties (variables) are defined in `app/globals.css` for both `[data-theme="light"]` and `[data-theme="dark"]`. The active theme is stored in `data-theme` on `<html>` and initialised by an inline script in `app/layout.tsx` before React hydrates, preventing a flash of unstyled content (FOUC).

---

## Contributing

Contributions are welcome! Here is how to get started:

1. **Fork** the repository and create a branch from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following the existing code style (TypeScript, inline styles, no external UI libraries unless discussed first).

3. **Lint** before opening a pull request:

   ```bash
   npm run lint
   ```

4. **Open a pull request** against `main` with a clear description of what changed and why.

### Branch naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<short-description>` | `feat/add-dark-mode` |
| Bug fix | `fix/<short-description>` | `fix/nav-overflow` |
| Docs | `docs/<short-description>` | `docs/readme-refresh` |
| Chore | `chore/<short-description>` | `chore/bump-deps` |

### Commit messages

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add Swedish locale
fix: resolve hydration mismatch in ThemeProvider
docs: update README installation steps
```

### Running the linter

```bash
npm run lint
```

There is no separate test suite at this time. Lint must pass before a PR can be merged.

---

## See Also

- [Next.js Documentation](https://nextjs.org/docs) — Official Next.js docs, including App Router guides
- [react-i18next](https://react.i18next.com/) — i18n library used in this project
- [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector) — Automatic language detection plugin
- [Next.js App Router Playground](https://github.com/vercel/app-playground) — Official Vercel examples for the App Router