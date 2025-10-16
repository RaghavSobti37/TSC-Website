import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-gray-800 dark:text-white">
          The Shakti Collective
        </Link>
        <DarkModeToggle />
      </div>
    </header>
  );
}
