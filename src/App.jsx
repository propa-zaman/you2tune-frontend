"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Music, Video, Loader2, CheckCircle, AlertCircle, Github, Twitter } from "lucide-react"

export default function App() {
  const [url, setUrl] = useState("")
  const [format, setFormat] = useState("mp3")
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState("")
  const [error, setError] = useState("")

  const handleDownload = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL")
      return
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
    if (!youtubeRegex.test(url)) {
      setError("Please enter a valid YouTube URL")
      return
    }

    setIsDownloading(true)
    setError("")
    setDownloadStatus("Preparing download...")

    try {
      const response = await fetch("http://localhost:4000/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, format }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Download failed")
      }

      setDownloadStatus("Download starting...")

      // Get filename from response headers
      const filename = response.headers.get("X-Filename") || `download.${format}`

      // Create blob and download
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)

      setDownloadStatus("Download completed!")
      setTimeout(() => setDownloadStatus(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">You2Tune</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              YouTube to MP3 & MP4
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">
                Converter
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Convert YouTube videos to high-quality MP3 audio or MP4 video files. Fast, free, and easy to use.
            </p>
          </div>

          {/* Converter Card */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="p-8">
              {/* URL Input */}
              <div className="mb-6">
                <Input
                  type="url"
                  placeholder="Paste YouTube URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-14 text-lg bg-white/90 border-white/30 placeholder:text-gray-500"
                  disabled={isDownloading}
                />
              </div>

              {/* Format Selection */}
              <div className="mb-8">
                <p className="text-white mb-4 font-medium">Choose format:</p>
                <div className="flex justify-center space-x-4">
                  <Button
                    variant={format === "mp3" ? "default" : "outline"}
                    onClick={() => setFormat("mp3")}
                    disabled={isDownloading}
                    className={`h-12 px-8 ${
                      format === "mp3"
                        ? "bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
                        : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                    }`}
                  >
                    <Music className="w-5 h-5 mr-2" />
                    MP3 Audio
                  </Button>
                  <Button
                    variant={format === "mp4" ? "default" : "outline"}
                    onClick={() => setFormat("mp4")}
                    disabled={isDownloading}
                    className={`h-12 px-8 ${
                      format === "mp4"
                        ? "bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
                        : "bg-white/10 border-white/30 text-white hover:bg-white/20"
                    }`}
                  >
                    <Video className="w-5 h-5 mr-2" />
                    MP4 Video
                  </Button>
                </div>
              </div>

              {/* Download Button */}
              <Button
                onClick={handleDownload}
                disabled={isDownloading || !url.trim()}
                className="h-14 px-12 text-lg font-semibold bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Convert & Download
                  </>
                )}
              </Button>

              {/* Status Messages */}
              {downloadStatus && (
                <div className="mt-4 flex items-center justify-center text-green-400">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {downloadStatus}
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-center justify-center text-red-400">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Downloads</h3>
              <p className="text-gray-300">High-speed conversion and download process</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">High Quality</h3>
              <p className="text-gray-300">Best audio and video quality preservation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">100% Free</h3>
              <p className="text-gray-300">No registration or payment required</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 You2Tune. All rights reserved.</p>
          <p className="mt-2 text-sm">Convert YouTube videos responsibly and respect copyright laws.</p>
        </div>
      </footer>
    </div>
  )
}
