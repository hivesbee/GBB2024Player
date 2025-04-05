import { useEffect, useState } from 'react';
import { PlaylistItem, fetchPlaylistData } from '../utils/playlist';

/**
 * Component that displays the playlist data
 */
export function PlaylistDisplay() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="playlist-container">
      <h2>Playlist</h2>
      {playlist.length === 0 ? (
        <p>No playlist items found</p>
      ) : (
        <ul className="playlist">
          {playlist.map((item, index) => (
            <li key={index} className="playlist-item">
              <div className="video-url">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.url}
                </a>
              </div>
              <div className="video-times">
                <span>Start: {formatTime(item.start)}</span>
                <span>End: {formatTime(item.end)}</span>
                <span>Duration: {formatTime(item.end - item.start)}</span>
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
