'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Download as DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface VideoPlayerProps {
  videoUrl: string
  title: string
  posterUrl?: string
}

const VideoPlayer = ({ videoUrl, title, posterUrl }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const hideControlsTimerRef = useRef<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false))
      } else {
        setIsPlaying(true)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleLoadedData = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setErrorMessage('Unable to load video')
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (hideControlsTimerRef.current) {
      window.clearTimeout(hideControlsTimerRef.current)
    }
    hideControlsTimerRef.current = window.setTimeout(() => {
      setShowControls(false)
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ') {
      e.preventDefault()
      togglePlay()
    } else if (e.key.toLowerCase() === 'm') {
      toggleMute()
    } else if (e.key.toLowerCase() === 'f') {
      handleFullscreen()
    } else if (e.key === 'ArrowLeft') {
      if (videoRef.current) {
        const newTime = Math.max(0, videoRef.current.currentTime - 5)
        videoRef.current.currentTime = newTime
        setCurrentTime(newTime)
      }
    } else if (e.key === 'ArrowRight') {
      if (videoRef.current) {
        const newTime = Math.min(duration, videoRef.current.currentTime + 5)
        videoRef.current.currentTime = newTime
        setCurrentTime(newTime)
      }
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value)
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const handleDownloadVideo = () => {
    try {
      const link = document.createElement('a')
      link.href = videoUrl
      link.download = `${title || 'video'}.mp4`
      link.target = '_blank'
      link.rel = 'noopener'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch {
      window.open(videoUrl, '_blank')
    }
  }

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadedData={handleLoadedData}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleError}
        poster={posterUrl || '/images/video-poster.jpg'}
        preload="metadata"
        playsInline
        muted={isMuted}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading State */}
      {isLoading && !errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error State */}
      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-4 py-2 bg-red-600 text-white rounded-md shadow-lg">{errorMessage}</div>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && !isLoading && !errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={togglePlay}
            className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-full"
          >
            <Play className="h-8 w-8 ml-1" />
          </Button>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress Bar */}
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <Button
              onClick={toggleMute}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              onClick={handleDownloadVideo}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <DownloadIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleFullscreen}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}

export default VideoPlayer


