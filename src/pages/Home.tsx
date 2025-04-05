import { Link } from '@tanstack/react-router';
import { PlaylistDisplay } from '../components/PlaylistDisplay';

export function Home() {

  return (
    <div className="container">
      <h1 style={{ color: '#f9f9f9' }}>GBB2024Player</h1>
      
      {/* プレイリスト表示コンポーネント */}
      <div style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', color: '#000' }}>
        <PlaylistDisplay />
      </div>

      <div>
        <Link to="/about" className="link">
          Go to About Page
        </Link>
      </div>
    </div>
  );
}
