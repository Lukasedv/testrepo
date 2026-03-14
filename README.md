# testrepo

A minimal Next.js Hello World demo showcasing the App Router.

## Getting Started

### Prerequisites

- Node.js 20.9.0 or later

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the Hello World page.

## Project Structure

```
app/
  layout.tsx   # Root layout
  page.tsx     # Root route — renders "Hello, World!"
next.config.js # Next.js configuration
tsconfig.json  # TypeScript configuration
package.json   # Project dependencies and scripts
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server at http://localhost:3000 |
| `npm run build` | Build the application for production |
| `npm start` | Start the production server (after build) |
| `npm run lint` | Run the Next.js linter |

## CI/CD Pipeline

This repository uses GitHub Actions to automatically validate every pull request and push to `main`.

### How it works

The CI workflow (`.github/workflows/ci.yml`) runs on:
- Every pull request targeting `main` (opened, updated, or reopened)
- Every direct push to `main`

**Steps performed by CI:**

1. Check out the repository at the correct commit
2. Set up Node.js 20
3. Restore cached npm dependencies (keyed on `package-lock.json`)
4. Install dependencies with `npm ci`
5. Build the site with `npm run build`
6. Upload the build output as a workflow artifact (on success)

### Branch protection

The `main` branch requires the **Build Site** CI check to pass before any pull request can be merged. Direct force pushes to `main` are also restricted.

### Interpreting CI results

- ✅ **Build Site** check passes → your changes are safe to merge (pending review)
- ❌ **Build Site** check fails → click the "Details" link next to the check to view the full build log and error output

### Contributing

1. Open a pull request against `main`.
2. Wait for the **Build Site** CI check to complete.
3. Fix any build errors reported in the CI logs before requesting a review.
4. Once the check passes and your PR is approved, it can be merged.