# Deployment Guide: GCP Pulse

This guide provides step-by-step instructions for deploying the GCP Pulse application to **Google Cloud Run**.

## 📂 File Structure

```
.
├── Dockerfile.txt       # Docker build instructions (rename to Dockerfile)
├── dockerignore.txt     # Files to ignore during Docker build (rename to .dockerignore)
├── deploy.md            # This guide
├── index.html           # Entry HTML
├── metadata.json        # App metadata
├── nginx.txt            # Nginx configuration (copied to /etc/nginx/nginx.conf)
├── package.json         # Dependencies and scripts
├── server.ts            # Express server entry point
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── src                  # Source code
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── types.ts
    ├── utils.ts
    ├── components/      # UI Components
    ├── hooks/           # Custom React Hooks
    ├── lib/             # Utilities (QueryClient)
    └── views/           # Page Views
```

---

## 🐳 Dockerization Strategy

The application uses a **hybrid architecture** inside a single container:

1.  **Nginx (Port 80)**: Acts as the reverse proxy and entry point. It handles incoming traffic, SSL termination (via Cloud Run), and forwards requests to the Node.js backend.
2.  **Node.js Server (Port 3000)**: Runs the Express/Vite application to serve the frontend and API.

The `Dockerfile` uses a **multi-stage build**:
*   **Builder Stage**: Compiles the React frontend using Vite.
*   **Runner Stage**: A lightweight Alpine image running both Nginx and Node.js via a startup script.

---

## 🚀 Deploying to Google Cloud Run

### Prerequisites

1.  **Google Cloud Project**: Create one at [console.cloud.google.com](https://console.cloud.google.com/).
2.  **Billing Enabled**: Ensure billing is active.
3.  **Google Cloud SDK (gcloud)**: Installed and authenticated.
    *   Run `gcloud auth login`
    *   Run `gcloud config set project YOUR_PROJECT_ID`

### Step 1: Prepare Docker Files

Ensure the following files exist in your root directory:

1.  **Dockerfile**: Rename `Dockerfile.txt` to `Dockerfile` if needed:
    ```bash
    mv Dockerfile.txt Dockerfile
    ```
2.  **.dockerignore**: Rename `dockerignore.txt` to `.dockerignore` if needed:
    ```bash
    mv dockerignore.txt .dockerignore
    ```

### Step 2: Build and Push the Image

Use **Cloud Build** to build and store the image in Google Container Registry (GCR) or Artifact Registry.

```bash
# Replace YOUR_PROJECT_ID with your actual project ID
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/gcp-pulse
```

*   *Note*: This process zips your code, uploads it, builds the container remotely, and stores it. It takes ~2-5 minutes.

### Step 3: Deploy Service

Deploy the container to Cloud Run.

```bash
gcloud run deploy gcp-pulse-service \
  --image gcr.io/YOUR_PROJECT_ID/gcp-pulse \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="your_gemini_api_key",YOUTUBE_API_KEY="your_youtube_api_key"
```

**Configuration Flags:**
*   `--allow-unauthenticated`: Makes the app public. Remove for internal-only apps.
*   `--set-env-vars`: **Required**. The app needs `GEMINI_API_KEY` for AI features and `YOUTUBE_API_KEY` for video enrichment.
*   *Note*: Cloud Run automatically injects the `PORT` environment variable (default 8080), and our container dynamically configures Nginx to listen on it. No manual port flag is needed.

### Step 4: Verify

You will see a URL like: `https://gcp-pulse-service-uc.a.run.app`. Click it to verify the deployment.

---

## 🛠️ Troubleshooting

**1. "Build failed"**
*   Ensure `package.json` and `package-lock.json` are present.
*   Check that `nginx.txt` exists (it's required for the Docker build).

**2. 502 Bad Gateway**
*   This usually means Nginx is running but can't reach the Node.js app.
*   Check Cloud Run logs. Ensure the Node.js server started successfully on port 3000.

**3. 500 Error / Crash on Start**
*   Check Cloud Run logs: `gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=gcp-pulse-service" --limit 20`
*   Common cause: Missing `GEMINI_API_KEY` environment variable.

**4. YouTube Data Missing**
*   Ensure `YOUTUBE_API_KEY` is set correctly. The app will log errors if enrichment fails.

---

## 💻 Local Development

1.  **Install**: `npm install`
2.  **Env**: Create a `.env` file with:
    ```env
    GEMINI_API_KEY=your_key
    YOUTUBE_API_KEY=your_key
    ```
3.  **Run**: `npm run dev` (Access at `http://localhost:3000`)

