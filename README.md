# SimpleRSS - Modern Feed Reader

SimpleRSS is a lightweight, high-fidelity RSS feed reader built as a Single Page Application (SPA). It features a "Unified Container" architecture with a high-performance **Bun** backend serving both the API for RSS parsing/caching and the static frontend assets.

## Features

*   **Modern UI**: Sleek dark mode design with glassmorphism effects, glowing borders, and smooth micro-animations.
*   **Bun Powered**: Ultra-fast startup times (<10ms) and high-performance native server logic, ideal for Cloud Run scale-to-zero.
*   **TypeScript**: Fully type-safe codebase (frontend & backend) using TypeScript for improved reliability.
*   **RSS Parsing**: Server-side parsing using `rss-parser` with in-memory caching for snappier experience.
*   **Security**: Secured with HTTP Basic Authentication to protect your data and prevent open-proxy abuse.
*   **Responsive**: Fully responsive grid layout that adapts to mobile and desktop screens.
*   **Cloud Ready**: Optimized for Google Cloud Run with minimal container footprint.

## Tech Stack

*   **Frontend**: TypeScript, Vite, Vanilla CSS.
*   **Backend**: Bun (Native `Bun.serve`).
*   **Language**: TypeScript.
*   **Containerization**: Docker (Bun multi-stage build).
*   **Deployment**: Google Cloud Run.

## Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mikeraimondi/simplerss.git
    cd simplerss
    ```

2.  **Install dependencies (using Bun):**
    ```bash
    bun install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    BASIC_AUTH_USER=admin
    BASIC_AUTH_PASSWORD=your_secure_password
    ```

4.  **Run Development Tools:**
    Run the backend and frontend concurrently for the best dev experience:

    *Terminal 1 (Backend):*
    ```bash
    bun run server.ts
    ```
    *Terminal 2 (Frontend):*
    ```bash
    bun run dev
    ```

5.  **Access the App:**
    Open `http://localhost:5173`. API requests are proxied via Vite to the Bun server.

## Testing

Run the entire test suite (Unit, Integration, and E2E) with one command:

```bash
bun run build # Ensure dist is up to date for E2E
bun run test  # Runs bun test && playwright test
```

*   **Unit Tests**: Logic for state management and reactive store (`tests/store.test.ts`).
*   **Integration Tests**: Server API endpoints and auth logic (`tests/server.test.ts`).
*   **E2E Tests**: Full UI flows and interaction via Playwright (`tests/e2e/*.e2e.ts`).

## Production Build & Docker

To build and run the production container locally:

1.  **Build the Image:**
    ```bash
    docker build -t simplerss .
    ```

2.  **Run the Container:**
    ```bash
    docker run -p 8080:8080 \
      -e BASIC_AUTH_USER=admin \
      -e BASIC_AUTH_PASSWORD=test \
      simplerss
    ```

3.  **Access:**
    Open `http://localhost:8080`.

## CI/CD Workflow

The project is configured with a **Google Cloud Run GitHub Integration**.

*   **Pushes to `main`**: Automatically trigger a build via Cloud Build and deploy a new revision to Cloud Run.
*   **Quality Gate**: Automated tests are enforced locally via Git Hooks (see below).

## Git Hooks

The project uses **Husky** to maintain code quality:

*   **Pre-push**: Automatically runs `bun run test` (Unit, Integration, and E2E) before any push to ensure only passing code is deployed.
*   **Setup**: Husky is initialized automatically during `bun install`.

## Cloud Run Deployment (Manual)

If you need to deploy manually or update configuration:

```bash
gcloud run deploy simplerss-app \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars BASIC_AUTH_USER=admin,BASIC_AUTH_PASSWORD=your_secure_password
```

## License

MIT
