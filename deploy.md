# Deployment Guide: GCP Pulse

This guide provides step-by-step instructions for deploying the GCP Pulse application to **Google Cloud Run**.

## 📂 File Structure

```
.
├── Dockerfile.txt       # Docker build instructions
├── dockerignore.txt     # Files to ignore during Docker build
├── deploy.md            # This guide
├── index.html           # Entry HTML
├── metadata.json        # App metadata
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

The application uses a **Node.js runtime** container:

1.  **Node.js Server (Port 3000)**: Runs the Express application which serves both the API endpoints and the static frontend files.
2.  **No Nginx Required**: The Express server handles static file serving in production, simplifying the architecture.

The `Dockerfile.txt` uses a **multi-stage build**:
*   **Builder Stage**: Compiles the React frontend using Vite.
*   **Runner Stage**: A lightweight Node.js Alpine image that runs the server.

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

1.  **Dockerfile.txt**: Defines the build and run process.
2.  **dockerignore.txt**: Specifies files to exclude from the Docker build.

These files are already included in the repository. Note: You may need to rename them to `Dockerfile` and `.dockerignore` for standard build tools.

### Step 2: Build and Push the Image

Use **Cloud Build** to build and store the image in Google Container Registry (GCR) or Artifact Registry.

```bash
# Replace YOUR_PROJECT_ID with your actual project ID
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/gcp-pulse
```

*   *Note*: This process zips your code, uploads it, builds the container remotely, and stores it. It takes ~2-5 minutes.

### Step 3: Deploy Service

Deploy the container to Cloud Run.

**Security Note:** We inject API keys as **runtime environment variables**. This is the most secure method for Cloud Run, as it keeps secrets out of the Docker image and out of the browser. The server accesses these keys securely to make API calls on behalf of the client.

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
*   *Note*: Cloud Run automatically injects the `PORT` environment variable, and our server is configured to listen on it (or default to 3000).

### Step 4: Verify

You will see a URL like: `https://gcp-pulse-service-uc.a.run.app`. Click it to verify the deployment.

---

## 🛠️ Troubleshooting

**1. "Build failed"**
*   Ensure `package.json` and `package-lock.json` are present.
*   Check that `Dockerfile.txt` is correctly named (or renamed to `Dockerfile`).

**2. 500 Error / Crash on Start**
*   Check Cloud Run logs: `gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=gcp-pulse-service" --limit 20`
*   Common cause: Missing `GEMINI_API_KEY` environment variable.

**3. YouTube Data Missing**
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

