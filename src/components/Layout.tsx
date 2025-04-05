import { Link, Outlet } from '@tanstack/react-router';

export function Layout() {
  return (
    <div className="layout">
      <main>
        <Outlet />
      </main>
      <footer>
        <p style={{ textAlign: 'center' }}>gbb2024player - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
