# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Environment Variables

- `VITE_API_BASE_URL`: The base URL for API calls.
  - **Purpose**: Specifies the endpoint for all backend API requests.
  - **Format**: `protocol://host[:port][/base-path]`. No trailing slash is recommended.
  - **Examples**:
    - Local Development: `http://localhost:3000/api`
    - Production: `https://api.yourdomain.com/api`
  - **Usage**: For local development, create a `.env` file in the project root (from `.env.example`) and set this variable.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
