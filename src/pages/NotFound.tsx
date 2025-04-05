import { Link } from '@tanstack/react-router';

export function NotFound() {
  return (
    <div className="container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <div>
        <Link to="/" className="link">
          Go to Home Page
        </Link>
      </div>
    </div>
  );
}
