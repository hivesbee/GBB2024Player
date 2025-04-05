import { Link, Outlet } from '@tanstack/react-router';

export function Layout() {
  return (
    <div className="layout">
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>GBB2024Player - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
