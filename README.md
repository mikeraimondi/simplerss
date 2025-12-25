# SimpleRSS - Modern Feed Reader

SimpleRSS is a lightweight, high-fidelity RSS feed reader built as a Single Page Application (SPA). It features a "Unified Container" architecture where a fast Express.js backend serves both the API for RSS parsing/caching and the static frontend assets.

## Features

*   **Modern UI**: Sleek dark mode design with glassmorphism effects, glowing borders, and smooth micro-animations.
*   **Unified Architecture**: Single Docker container handling both frontend serving and backend API logic.
*   **RSS Parsing**: Robust server-side parsing using `rss-parser` with in-memory caching (10-minute TTL) for performance.
*   **Security**: Secured with HTTP Basic Authentication to prevent unauthorized access.
*   **Responsive**: Fully responsive grid layout that adapts to mobile and desktop screens.
*   **Cloud Ready**: Optimized for Google Cloud Run with scale-to-zero capabilities.

## Tech Stack

*   **Frontend**: Vanilla JavaScript, Vite, CSS3 (Variables, Flexbox/Grid).
*   **Backend**: Node.js, Express.js.
*   **Containerization**: Docker (Multi-stage build).
*   **Deployment**: Google Cloud Run.

## Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mikeraimondi/simplerss.git
    cd simplerss
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    BASIC_AUTH_USER=admin
    BASIC_AUTH_PASSWORD=your_secure_password
    ```

4.  **Run Development Server:**
    Run the backend and frontend concurrently (requires two terminals):

    *Terminal 1 (Backend):*
    ```bash
    node server.js
    ```
    *Terminal 2 (Frontend):*
    ```bash
    npm run dev
    ```

5.  **Access the App:**
    Open `http://localhost:5173`. The Vite proxy will forward API requests to the Express backend.

## Production Build & Docker

To build and run the production container locally:

1.  **Build the Image:**
    ```bash
    docker build -t simplerss .
    ```

2.  **Run the Container:**
    ```bash
    docker run -p 8080:8080 -e BASIC_AUTH_USER=admin -e BASIC_AUTH_PASSWORD=test simplerss
    ```

3.  **Access:**
    Open `http://localhost:8080`.

## Cloud Run Deployment

Deploy directly from source using the Google Cloud CLI:

```bash
gcloud run deploy simplerss-app \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars BASIC_AUTH_USER=admin,BASIC_AUTH_PASSWORD=your_secure_password
```

*Note: `--allow-unauthenticated` is used because the application handles its own authentication via Basic Auth middleware.*

## License

MIT
