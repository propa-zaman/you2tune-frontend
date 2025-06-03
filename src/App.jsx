"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Download,
  Music,
  Video,
  Loader2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ThumbsUp,
  ShieldCheck,
  Smartphone,
  ClipboardCopy,
  MousePointerIcon as MousePointerSquare,
  DownloadCloud,
  FileAudio,
  FileVideo,
  PlaySquare,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
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
              Convert YouTube videos and Shorts to high-quality MP3 audio or MP4 video files. Fast, free, and easy to
              use.
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

          {/* How to Use Section */}
          <div className="mt-20 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">How to Use You2Tune</h2>
            <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
              Downloading your favorite YouTube content is as easy as 1-2-3.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="w-full h-[150px] flex items-center justify-center mb-4">
                  <ClipboardCopy className="w-24 h-24 text-pink-400" />
                </div>
                <h3 className="text-2xl font-semibold text-pink-400 mb-2">1. Copy YouTube URL</h3>
                <p className="text-gray-300">
                  Go to YouTube, find the video or audio you want, and copy its URL from the address bar or share menu.
                </p>
              </Card>
              {/* Step 2 */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="w-full h-[150px] flex items-center justify-center mb-4">
                  <MousePointerSquare className="w-24 h-24 text-pink-400" />
                </div>
                <h3 className="text-2xl font-semibold text-pink-400 mb-2">2. Paste the Link</h3>
                <p className="text-gray-300">
                  Return to You2Tune and paste the copied YouTube URL into the input field at the top of the page.
                </p>
              </Card>
              {/* Step 3 */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                <div className="w-full h-[150px] flex items-center justify-center mb-4">
                  <DownloadCloud className="w-24 h-24 text-pink-400" />
                </div>
                <h3 className="text-2xl font-semibold text-pink-400 mb-2">3. Convert & Download</h3>
                <p className="text-gray-300">
                  Choose your desired format (MP3 or MP4) and click the "Convert & Download" button. Your file will be
                  ready shortly!
                </p>
              </Card>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="mt-20 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose You2Tune?</h2>
            <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
              We offer a seamless and reliable experience for converting YouTube content.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 bg-white/5 rounded-lg">
                <Download className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-gray-300">Optimized servers for the quickest conversion and download speeds.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-lg">
                <Smartphone className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">All Devices Supported</h3>
                <p className="text-gray-300">Works on desktops, tablets, and mobile phones seamlessly.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-lg">
                <ThumbsUp className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Superior Quality</h3>
                <p className="text-gray-300">Download content in its best available MP3 or MP4 quality.</p>
              </div>
              <div className="p-6 bg-white/5 rounded-lg">
                <ShieldCheck className="w-12 h-12 text-pink-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
                <p className="text-gray-300">No registration needed. Your downloads are processed securely.</p>
              </div>
            </div>
          </div>

          {/* Detailed Features Section */}
          <div className="mt-20">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">You2Tune Features</h2>
            <div className="space-y-12">
              {/* MP3 Downloader Feature */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2 p-8">
                    <h3 className="text-3xl font-semibold text-pink-400 mb-4">YouTube to MP3 Converter</h3>
                    <p className="text-gray-200 text-lg mb-4">
                      Easily convert your favorite YouTube videos into high-quality MP3 audio files. Perfect for
                      listening to music, podcasts, or lectures offline.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>High bitrate audio output</li>
                      <li>Fast conversion process</li>
                      <li>Includes metadata (title, artist if available)</li>
                    </ul>
                  </div>
                  <div className="md:w-1/2 flex items-center justify-center p-8 bg-white/5">
                    <FileAudio className="w-32 h-32 text-pink-400 md:w-48 md:h-48" />
                  </div>
                </div>
              </Card>

              {/* MP4 Downloader Feature */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 overflow-hidden">
                <div className="md:flex md:flex-row-reverse">
                  <div className="md:w-1/2 p-8">
                    <h3 className="text-3xl font-semibold text-pink-400 mb-4">YouTube to MP4 Converter</h3>
                    <p className="text-gray-200 text-lg mb-4">
                      Download YouTube videos as MP4 files in various resolutions. Save videos for offline viewing on
                      any device.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Supports multiple resolutions (up to 720p based on your backend)</li>
                      <li>Keeps original video quality</li>
                      <li>Compatible with all video players</li>
                    </ul>
                  </div>
                  <div className="md:w-1/2 flex items-center justify-center p-8 bg-white/5">
                    <FileVideo className="w-32 h-32 text-pink-400 md:w-48 md:h-48" />
                  </div>
                </div>
              </Card>

              {/* YouTube Shorts Downloader Feature */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2 p-8">
                    <h3 className="text-3xl font-semibold text-pink-400 mb-4">YouTube Shorts Downloader</h3>
                    <p className="text-gray-200 text-lg mb-4">
                      Quickly save your favorite YouTube Shorts in MP4 format. Enjoy short-form content offline,
                      anytime, anywhere.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Download Shorts in their original quality</li>
                      <li>Perfect for sharing or rewatching</li>
                      <li>Simple and fast process</li>
                    </ul>
                  </div>
                  <div className="md:w-1/2 flex items-center justify-center p-8 bg-white/5">
                    <PlaySquare className="w-32 h-32 text-pink-400 md:w-48 md:h-48" />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div id="faq-section" className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="bg-white/10 border-white/20 rounded-lg mb-3">
                <AccordionTrigger className="p-6 text-lg font-medium text-white hover:no-underline">
                  Is You2Tune free to use?
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 text-gray-300">
                  Yes, You2Tune is completely free to use. There are no hidden charges or subscription fees.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white/10 border-white/20 rounded-lg mb-3">
                <AccordionTrigger className="p-6 text-lg font-medium text-white hover:no-underline">
                  What formats can I download?
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 text-gray-300">
                  You can download YouTube videos as MP3 (audio) or MP4 (video) files.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2b" className="bg-white/10 border-white/20 rounded-lg mb-3">
                <AccordionTrigger className="p-6 text-lg font-medium text-white hover:no-underline">
                  Can I download YouTube Shorts?
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 text-gray-300">
                  Yes, You2Tune fully supports downloading YouTube Shorts. Just paste the Short's URL, choose MP4
                  format, and download it just like any other YouTube video.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white/10 border-white/20 rounded-lg mb-3">
                <AccordionTrigger className="p-6 text-lg font-medium text-white hover:no-underline">
                  Is it legal to download YouTube videos?
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 text-gray-300">
                  Downloading copyrighted material without permission may be illegal in your country. You2Tune should be
                  used only for content that you have the right to download, such as non-copyrighted videos or videos
                  for which you have explicit permission from the copyright holder. Please respect copyright laws.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white/10 border-white/20 rounded-lg mb-3">
                <AccordionTrigger className="p-6 text-lg font-medium text-white hover:no-underline">
                  Do I need to install any software?
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 text-gray-300">
                  No, You2Tune is a web-based application. You don't need to install any software or browser extensions.
                  Everything works directly in your browser.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white/10 border-white/20 rounded-lg mb-3">
                <AccordionTrigger className="p-6 text-lg font-medium text-white hover:no-underline">
                  What is the maximum video length or file size I can download?
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 text-gray-300">
                  While we aim to support most videos, very long videos or extremely large files might encounter
                  timeouts or issues due to server limitations. We recommend shorter clips for the best experience. Your
                  backend has a 5-minute timeout for downloads.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
