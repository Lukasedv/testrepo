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