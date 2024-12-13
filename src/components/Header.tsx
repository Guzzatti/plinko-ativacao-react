import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-[#e5bb6f] to-[#c19e5a] p-2 shadow-md">
      <div className="container mx-auto flex items-center justify-center">
        <Link to="/">
          <img src="src/fotos/logo1.png" alt="Guzzatti Logo" className="h-16" />
        </Link>
      </div>
    </header>
  );
}
