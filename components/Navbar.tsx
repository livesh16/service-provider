import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center py-6 px-8 bg-white/90 backdrop-blur-md fixed top-0 z-50">
      <div className="text-2xl font-bold text-gray-900">Mauritius Menus</div>
      <ul className="flex gap-8 text-gray-700 font-medium">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/restaurants">Restaurants</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
    </nav>
  );
}
