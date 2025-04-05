import { PlaylistDisplay } from '../components/PlaylistDisplay';

export function Home() {

  return (
    <div className="container">
      <h1 style={{ color: '#f9f9f9', textAlign: 'center' }}>GBB2024Player</h1>
      
      {/* プレイリスト表示コンポーネント */}
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <PlaylistDisplay />
      </div>
    </div>
  );
}
