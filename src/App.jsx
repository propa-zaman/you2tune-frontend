import { useState } from 'react';

const BACKEND_URL = 'http://localhost:4000';

function App() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadFilename, setDownloadFilename] = useState('');

  const handleDownload = async () => {
    setError('');
    setDownloadUrl('');
    setDownloadFilename('');

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, format }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Download failed');
        setLoading(false);
        return;
      }

      // Get filename from multiple possible sources
      let filename = response.headers.get('X-Filename') || 
                    response.headers.get('x-filename') ||
                    response.headers.get('content-disposition');
      
      // Parse content-disposition header if that's what we got
      if (filename && filename.includes('filename=')) {
        const match = filename.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, '');
        }
      }
      
      // Fallback to default name
      if (!filename) {
        filename = `download.${format}`;
      }

      console.log('Extracted filename:', filename); // Debug log

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      setDownloadUrl(blobUrl);
      setDownloadFilename(filename);
      
      // Auto-download the file immediately
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up blob URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        setDownloadUrl('');
      }, 5000);
      
    } catch (err) {
      console.error('Download error:', err);
      setError('An unexpected error occurred');
    }
    setLoading(false);
  };

  const downloadAgain = () => {
    if (!downloadUrl || !downloadFilename) return;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">You2Tune - YouTube Audio & Video Downloader</h1>

      <input
        type="text"
        placeholder="Enter YouTube video URL"
        className="w-full max-w-lg p-3 rounded border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className="flex space-x-6 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="format"
            value="mp3"
            checked={format === 'mp3'}
            onChange={() => setFormat('mp3')}
            className="form-radio"
          />
          <span>MP3 (Audio only)</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="format"
            value="mp4"
            checked={format === 'mp4'}
            onChange={() => setFormat('mp4')}
            className="form-radio"
          />
          <span>MP4 (Video + Audio)</span>
        </label>
      </div>

      <button
        className={`px-6 py-3 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
        onClick={handleDownload}
      >
        {loading ? 'Processing...' : 'Download'}
      </button>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {downloadFilename && (
        <div className="mt-6 text-center">
          <p className="text-green-600 mb-2">
            ✅ Downloaded: <strong>{downloadFilename}</strong>
          </p>
          {downloadUrl && (
            <button
              onClick={downloadAgain}
              className="text-purple-700 underline hover:text-purple-900 bg-transparent border-none cursor-pointer"
            >
              Download again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;