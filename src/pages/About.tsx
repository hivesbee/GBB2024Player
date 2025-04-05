import { Link } from '@tanstack/react-router';

export function About() {
  return (
    <div className="container">
      <h1>About Page</h1>
      <p>This is a simple demo of TanStack Router with React and TypeScript.</p>
      <div>
        <Link to="/" className="link">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
