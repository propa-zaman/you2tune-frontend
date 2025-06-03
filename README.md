# You2Tune - Frontend (React)

React frontend SPA for YouTube to MP3 & MP4 conversion.

## Features
- Paste YouTube URL
- Choose MP3 or MP4 format
- Download converted files
- Responsive UI with status and error messages
- FAQ and usage instructions included

## Setup & Run Locally

1. Clone the repo:

```bash
git clone https://github.com/yourusername/you2tune-frontend.git
cd you2tune-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a \`.env\` file in the root:

```bash
VITE_BACKEND_URL=http://localhost:4000
```

4. Start development server:

```bash
npm run dev
```

Open your browser at \`http://localhost:5173\` (or the port shown in the terminal).

## Build for Production

```bash
npm run build
```

Production-ready files will be in the \`dist\` directory.

Deploy \`dist\` on Vercel, Netlify, or any static hosting.

Make sure to set \`VITE_BACKEND_URL\` to your deployed backend API URL in production.

## Deployment Recommendations

- Backend on VPS or cloud server where ffmpeg and yt-dlp are installed.
- Frontend on Vercel or any static hosting service.

## License

MIT License

## Author

Your Name | [Afra Zaman](https://github.com/propa-zaman)
