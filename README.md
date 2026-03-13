# testrepo

> A minimal, zero-dependency **Hello World** demo site — a clean starting point for static-web experiments, CI/CD pipelines, and GitHub workflow testing.

[![GitHub Pages](https://img.shields.io/badge/demo-live-brightgreen?logo=github)](https://lukasedv.github.io/testrepo/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![Open Issues](https://img.shields.io/github/issues/Lukasedv/testrepo)](https://github.com/Lukasedv/testrepo/issues)

---

## Table of Contents

- [About](#about)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## About

**testrepo** is a lightweight static site that renders a centred "Hello, World! 👋" card in the browser. It is intentionally simple so it can serve as:

- A **template** for bootstrapping new static-web projects.
- A **sandbox** for testing GitHub Actions, deployment workflows, and repository settings.
- A **reference** for clean, dependency-free HTML/CSS page structure.

---

## Getting Started

### Prerequisites

All you need is a modern web browser (Chrome, Firefox, Safari, Edge). No build tools, package managers, or server runtimes are required.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Lukasedv/testrepo.git
   cd testrepo
   ```

2. That's it — no `npm install` or other setup steps needed.

### Usage

**Option A — open directly in your browser**

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows (PowerShell)
Start-Process index.html
```

**Option B — serve with a local HTTP server** *(recommended to avoid browser CORS restrictions for future extensions)*

```bash
# Python 3
python -m http.server 8080
# Then visit http://localhost:8080
```

The page displays a centred card with a greeting:

```
┌──────────────────────────┐
│   Hello, World! 👋       │
│   Welcome to the demo    │
│   base site.             │
└──────────────────────────┘
```

---

## Project Structure

```
testrepo/
├── index.html   # Main (and only) page — self-contained HTML + CSS
└── README.md    # This file
```

| File | Purpose |
|------|---------|
| `index.html` | Renders the Hello World card using plain HTML and inline CSS. No external dependencies. |
| `README.md` | Project documentation. |

---

## Contributing

Contributions, bug reports, and feature requests are welcome!

1. **Fork** the repository and create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit them with a descriptive message:

   ```bash
   git commit -m "feat: add your feature"
   ```

3. **Push** to your fork and open a **Pull Request** against `main`.

Please follow these guidelines:

- Keep pull requests focused on a single change.
- Describe *what* you changed and *why* in the PR description.
- Ensure the page still renders correctly in a browser before submitting.

For bug reports or feature ideas, [open an issue](https://github.com/Lukasedv/testrepo/issues).

---

## License

This project is licensed under the [MIT License](LICENSE).

> You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this software. See the [MIT License](https://opensource.org/licenses/MIT) for full terms.
