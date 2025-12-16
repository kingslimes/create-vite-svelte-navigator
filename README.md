# create-vite-svelte-navigator

Scaffold a **Vite + Svelte** project with **vite-svelte-navigator** preconfigured.  
Fast setup, clean routing, and a friendly interactive CLI ✨

---

## ✨ Features

- ⚡ Vite + Svelte (JavaScript or TypeScript)
- 🧭 Preconfigured **vite-svelte-navigator**
- 📁 Pages-based routing structure
- 🧑‍💻 Interactive CLI (powered by `@clack/prompts`)
- 📦 Auto-detects package manager (npm / pnpm / yarn / bun)

---

## 🚀 Getting Started

You can run the CLI using **npx**, **pnpm**, **yarn**, or **bun**.

```bash
npx create-vite-svelte-navigator my-app
```

or

```bash
pnpm create vite-svelte-navigator my-app
```

or

```bash
yarn create vite-svelte-navigator my-app
```

or

```bash
bunx create-vite-svelte-navigator my-app
```

---

## 🧑‍💻 Interactive Setup

During setup, the CLI will ask you:

- Project name
- Language (TypeScript or JavaScript)
- Confirm before deleting files (if the directory is not empty)

---

## 📁 Project Structure

After creation, your project will look like this:

```bash
my-app/
├─ src/
│  ├─ pages/
│  │  └─ Home.svelte
│  ├─ App.svelte
│  └─ main.ts
├─ index.html
├─ package.json
└─ vite.config.ts
```

---

## 🧭 Routing Example

Routing is already set up using **vite-svelte-navigator**.

```svelte
<script lang="ts">
  import { RouterProvider, createBrowserRouter } from 'vite-svelte-navigator';
  import Home from './pages/Home.svelte';

  const router = createBrowserRouter([
    { path: '/', element: Home }
  ]);
</script>

<RouterProvider {router} />
```

---

## 📦 Installed Dependencies

The CLI automatically installs:

- `vite`
- `svelte`
- `vite-svelte-navigator`

---

## ⚙️ Available Flags

You can skip prompts using flags:

```bash
--ts, --typescript    Use TypeScript
--js, --javascript    Use JavaScript
```

Example:

```bash
npm create vite-svelte-navigator my-app --ts
```
or `bun`
```bash
bun create vite-svelte-navigator my-app --ts
```

---

## ⚠️ Notes

- If the target directory is **not empty**, the CLI will ask for confirmation before deleting files.
- Default package manager is auto-detected from your environment.

---

## 📄 License

MIT License

---

## ❤️ Credits

- Vite
- Svelte
- vite-svelte-navigator
