"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Desktop links (horizontal)
  const desktopLinks = (
    <>
      <li className="hover:text-gray-900 transition text-lg">
        <Link href="/">Home</Link>
      </li>
      <li className="hover:text-gray-900 transition text-lg">
        <Link href="/service-providers">Providers</Link>
      </li>
      <li className="hover:text-gray-900 transition text-lg">
        <Link href="/categories">Categories</Link>
      </li>
      <li className="hover:text-gray-900 transition text-lg">
        <Link href="/about">About</Link>
      </li>

      {status !== "loading" && session && session.user && (
        <li className="flex items-center gap-2">
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-6 h-6 rounded-full border-2 border-gray-300"
            />
          )}
          <span className="text-gray-900 font-medium text-md">
            {session.user.name || "User"}
          </span>
        </li>
      )}

      <li>
        {status !== "loading" &&
          (session ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          ))}
      </li>
    </>
  );

  // Mobile links (vertical)
  const mobileLinks = (
    <>
      <li>
        <Link
          href="/"
          className="block px-4 py-2 hover:text-gray-900 hover:bg-gray-100 rounded transition"
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/service-providers"
          className="block px-4 py-2 hover:text-gray-900 hover:bg-gray-100 rounded transition"
        >
          Providers
        </Link>
      </li>
      <li>
        <Link
          href="/categories"
          className="block px-4 py-2 hover:text-gray-900 hover:bg-gray-100 rounded transition"
        >
          Categories
        </Link>
      </li>
      <li>
        <Link
          href="/about"
          className="block px-4 py-2 hover:text-gray-900 hover:bg-gray-100 rounded transition"
        >
          About
        </Link>
      </li>

      {status !== "loading" && session && session.user && (
        <li className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded transition">
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-8 h-8 rounded-full border-2 border-gray-300"
            />
          )}
          <span className="text-gray-900 font-medium">
            {session.user.name || "User"}
          </span>
        </li>
      )}

      <li className="px-4 py-2">
        {status === "loading" ? null : session ? (
          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        )}
      </li>
    </>
  );

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md fixed top-0 z-50 shadow-md">
        <div className="flex justify-between items-center py-6 px-6 md:px-8">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-900">MoService</div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 text-gray-700 font-medium items-center">
          {desktopLinks}
        </ul>

        {/* Hamburger Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="flex flex-col gap-2 px-2 py-4 md:hidden text-gray-700 font-medium bg-white/95 backdrop-blur-md shadow-lg">
          {mobileLinks}
        </ul>
      )}
    </nav>
  );
}
