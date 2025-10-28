import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <Image src="/assets/LogoArtboard 1.png" alt="The Shakti Collective Logo" width={150} height={100} />
        </Link>
        <DarkModeToggle />
      </div>
    </header>
  );
}
