import { useEffect, useState, useCallback, useRef } from 'react';
import { PlaylistItem, fetchPlaylistData } from '../utils/playlist';
import { YouTubePlayer } from './YouTubePlayer';
import playIcon from '../assets/icons/play_arrow_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';
import pauseIcon from '../assets/icons/pause_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';
import stopIcon from '../assets/icons/stop_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';
import shuffleIcon from '../assets/icons/shuffle_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';
import shuffleOnIcon from '../assets/icons/shuffle_on_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.svg';

/**
 * Component that displays the playlist data
 */
export function PlaylistDisplay() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<PlaylistItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffleMode, setIsShuffleMode] = useState(true);
  const [wasStopped, setWasStopped] = useState(false);
  const currentIndexRef = useRef<number>(-1);

  // Function to toggle between shuffle and normal play
  const togglePlayMode = useCallback(() => {
    if (playlist.length === 0) return;
    
    setIsShuffleMode(prevMode => !prevMode);
  }, [playlist]);

  useEffect(() => {
    async function loadPlaylist() {
      try {
        setLoading(true);
        const data = await fetchPlaylistData();
        setPlaylist(data);
        setError(null);
      } catch (err) {
        setError('Failed to load playlist data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPlaylist();
  }, []);

  if (loading) {
    return <div>Loading playlist...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Handle playlist item click
  const handlePlaylistItemClick = (item: PlaylistItem, index: number) => {
    setCurrentItem(item);
    currentIndexRef.current = index;
  };

  return (
    <div className="playlist-container">
      {/* YouTube Player */}
      <div className="youtube-player-section">
        <YouTubePlayer 
          currentItem={currentItem} 
          onPlayPause={(playing) => setIsPlaying(playing)}
          onStop={() => setIsPlaying(false)}
        />
      </div>

      {/* Player Controls Section */}
      <div className="random-play-section">
        <button 
          className="random-play-button"
          onClick={togglePlayMode}
          disabled={playlist.length === 0}
        >
          <img 
            src={isShuffleMode ? shuffleOnIcon : shuffleIcon} 
            alt={isShuffleMode ? "Shuffle Play" : "Normal Play"} 
            style={{ 
              width: '24px', 
              height: '24px',
              filter: 'brightness(0) invert(1)' // Makes the icon white
            }} 
          />
        </button>
        
        <button 
          className="control-button"
          onClick={() => {
            // If no item is selected or we're starting a new track
            if ((!currentItem || wasStopped) && playlist.length > 0) {
              // In shuffle mode, play a random track
              if (isShuffleMode) {
                const randomIndex = Math.floor(Math.random() * playlist.length);
                setCurrentItem(playlist[randomIndex]);
                currentIndexRef.current = randomIndex;
              } 
              // In normal mode, play from the beginning or next track
              else {
                // If we have a current index, play the next track, otherwise start from the beginning
                const nextIndex = currentIndexRef.current >= 0 ? 
                  (currentIndexRef.current + 1) % playlist.length : 0;
                setCurrentItem(playlist[nextIndex]);
                currentIndexRef.current = nextIndex;
              }
              setIsPlaying(true);
              setWasStopped(false);
              return;
            }
            
            // This will trigger the onPlayPause callback in YouTubePlayer
            setIsPlaying(!isPlaying);
            const playerElement = document.getElementById('youtube-player') as HTMLIFrameElement | null;
            if (playerElement && playerElement.contentWindow) {
              if (isPlaying) {
                playerElement.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
              } else {
                // If the video was stopped, restart from the start value
                if (wasStopped && currentItem) {
                  const videoId = extractVideoId(currentItem.url);
                  if (videoId) {
                    // Load the video and immediately play it from the start value
                    playerElement.contentWindow.postMessage(`{"event":"command","func":"loadVideoById","args":{"videoId":"${videoId}","startSeconds":${currentItem.start},"endSeconds":${currentItem.end}}}`, '*');
                    // Small timeout to ensure the video is loaded before playing
                    setTimeout(() => {
                      const playerEl = document.getElementById('youtube-player') as HTMLIFrameElement | null;
                      if (playerEl && playerEl.contentWindow) {
                        playerEl.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                      }
                    }, 100);
                    setWasStopped(false);
                  }
                } else {
                  playerElement.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                }
              }
            }
          }}
          disabled={playlist.length === 0}
        >
          <img 
            src={isPlaying ? pauseIcon : playIcon} 
            alt={isPlaying ? "Pause" : "Play"} 
            style={{ 
              width: '24px', 
              height: '24px',
              filter: 'brightness(0) invert(1)' // Makes the icon white
            }} 
          />
        </button>
        
        <button 
          className="control-button"
          onClick={() => {
            setIsPlaying(false);
            setWasStopped(true);
            const playerElement = document.getElementById('youtube-player') as HTMLIFrameElement | null;
            if (playerElement && playerElement.contentWindow) {
              playerElement.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
            }
          }}
          disabled={!currentItem}
        >
          <img 
            src={stopIcon} 
            alt="Stop" 
            style={{ 
              width: '24px', 
              height: '24px',
              filter: 'brightness(0) invert(1)' // Makes the icon white
            }} 
          />
        </button>
      </div>

      <h2>Playlist</h2>
      {playlist.length === 0 ? (
        <p>No playlist items found</p>
      ) : (
        <ul className="playlist">
          {playlist.map((item, index) => (
            <li 
              key={index} 
              className={`playlist-item ${currentItem === item ? 'active' : ''}`}
              onClick={() => handlePlaylistItemClick(item, index)}
            >
              <div className="playlist-item-content">
                <div className="video-artist">
                  {item.artist}
                </div>
                <div className="video-duration">
                  {formatTime(item.end - item.start)}
                </div>
                <div className="video-url">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    YouTube
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Formats seconds into a MM:SS format
 */
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}
