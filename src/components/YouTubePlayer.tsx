import { useEffect, useRef, useState } from 'react';
import { PlaylistItem } from '../utils/playlist';

// Declare the YouTube Player API types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: {
            start?: number;
            end?: number;
            autoplay?: 0 | 1;
            controls?: 0 | 1;
            rel?: 0 | 1;
            showinfo?: 0 | 1;
            modestbranding?: 0 | 1;
            disablekb?: 0 | 1;
          };
          events?: {
            onReady?: (event: any) => void;
            onStateChange?: (event: any) => void;
            onError?: (event: any) => void;
          };
        }
      ) => any;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  currentItem: PlaylistItem | null;
  onPlayPause?: (isPlaying: boolean) => void;
  onStop?: () => void;
}

export function YouTubePlayer({ currentItem, onPlayPause, onStop }: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize the YouTube player
  useEffect(() => {
    // Check if YouTube API is loaded
    if (!window.YT) {
      // Create a callback for when the API is ready
      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
      return;
    }

    initializePlayer();

    return () => {
      // Clean up player on component unmount
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Function to initialize the YouTube player
  const initializePlayer = () => {
    if (!containerRef.current) return;
    
    playerRef.current = new window.YT.Player('youtube-player', {
      videoId: '', // Will be set when a playlist item is clicked
      playerVars: {
        controls: 0,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        disablekb: 1,
      },
      events: {
        onReady: () => {
          setPlayerReady(true);
        },
        onStateChange: (event) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        },
        onError: (event) => {
          console.error('YouTube Player Error:', event);
        },
      },
    });
  };

  // Play the selected video when currentItem changes
  useEffect(() => {
    if (!playerReady || !playerRef.current || !currentItem) return;

    try {
      // Extract video ID from YouTube URL
      const videoId = extractVideoId(currentItem.url);
      if (!videoId) {
        console.error('Invalid YouTube URL:', currentItem.url);
        return;
      }

      // Load and play the video
      playerRef.current.loadVideoById({
        videoId,
        startSeconds: currentItem.start,
        endSeconds: currentItem.end,
      });
    } catch (error) {
      console.error('Error playing video:', error);
    }
  }, [currentItem, playerReady]);

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Player control functions
  const handlePlayPause = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    
    // Call the callback if provided
    if (onPlayPause) {
      onPlayPause(!isPlaying);
    }
  };

  const handleStop = () => {
    if (!playerRef.current) return;
    playerRef.current.stopVideo();
    
    // Call the callback if provided
    if (onStop) {
      onStop();
    }
  };

  return (
    <div className="youtube-player-container">
      <h3>Now Playing</h3>
      <div className="player-wrapper" style={{ display: 'none' }}>
        <div id="youtube-player" ref={containerRef}></div>
      </div>
      <div className="now-playing-info">
        {currentItem ? (
          <>
            <p>
              {isPlaying ? 'Playing' : 'Paused'} - {currentItem.artist}
            </p>
            <p>
              Start: {formatTime(currentItem.start)}, 
              End: {formatTime(currentItem.end)}
            </p>
          </>
        ) : (
          <p>No track selected. Select a track from the playlist to play.</p>
        )}
      </div>
      {/* Player controls moved to PlaylistDisplay component */}
    </div>
  );
}

// Format seconds to MM:SS
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
