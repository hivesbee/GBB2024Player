/**
 * Type definition for a playlist item
 */
export interface PlaylistItem {
  artist: string;
  url: string;
  start: number;
  end: number;
}

/**
 * Fetches and parses the playlist data from the CSV file
 * @returns Promise that resolves to an array of PlaylistItem objects
 */
export async function fetchPlaylistData(): Promise<PlaylistItem[]> {
  try {
    // Fetch the CSV file
    const response = await fetch('/src/assets/playlist.csv');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch playlist data: ${response.status} ${response.statusText}`);
    }
    
    // Get the CSV text
    const csvText = await response.text();
    
    // Parse the CSV data
    const lines = csvText.split('\n');
    
    // Skip the header line and filter out any empty lines
    const dataLines = lines.slice(1).filter(line => line.trim() !== '');
    
    // Parse each line into a PlaylistItem
    const playlistItems = dataLines.map(line => {
      // Split by comma and trim whitespace
      const [artist, url, startStr, endStr] = line.split(',').map(item => item.trim());
      
      // Convert start and end to numbers
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      
      return { artist, url, start, end };
    });
    
    return playlistItems;
  } catch (error) {
    console.error('Error fetching playlist data:', error);
    throw error;
  }
}

/**
 * Example usage:
 * 
 * import { fetchPlaylistData } from './utils/playlist';
 * 
 * async function loadPlaylist() {
 *   try {
 *     const playlist = await fetchPlaylistData();
 *     console.log(playlist);
 *     // Do something with the playlist data
 *   } catch (error) {
 *     console.error('Failed to load playlist:', error);
 *   }
 * }
 */
