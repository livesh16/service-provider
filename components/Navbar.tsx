"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // <-- import Image from Next.js
import { signIn, signOut, useSession } from "next-auth/react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string>("");

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleMobileLinkClick = (href: string) => {
    setActiveLink(href);
    setIsOpen(false);
  };

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

      {status !== "loading" && session?.user && (
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

  const mobileLinkClass = (href: string) =>
    `block px-4 py-2 rounded transition cursor-pointer ${
      activeLink === href
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "hover:bg-gray-100 hover:text-gray-900"
    }`;

  const mobileLinks = (
    <>
      <li>
        <Link
          href="/"
          className={mobileLinkClass("/")}
          onClick={() => handleMobileLinkClick("/")}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/service-providers"
          className={mobileLinkClass("/service-providers")}
          onClick={() => handleMobileLinkClick("/service-providers")}
        >
          Providers
        </Link>
      </li>
      <li>
        <Link
          href="/categories"
          className={mobileLinkClass("/categories")}
          onClick={() => handleMobileLinkClick("/categories")}
        >
          Categories
        </Link>
      </li>
      <li>
        <Link
          href="/about"
          className={mobileLinkClass("/about")}
          onClick={() => handleMobileLinkClick("/about")}
        >
          About
        </Link>
      </li>

      {status !== "loading" && session?.user && (
        <li
          className={`flex items-center gap-3 px-4 py-2 rounded transition ${
            activeLink === "user" ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
          onClick={() => handleMobileLinkClick("user")}
        >
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
            onClick={() => {
              signOut();
              handleMobileLinkClick("logout");
            }}
            className={
              mobileLinkClass("logout") +
              " w-full text-left bg-red-600 text-white hover:bg-red-700"
            }
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => {
              signIn("google");
              handleMobileLinkClick("login");
            }}
            className={
              mobileLinkClass("login") +
              " w-full text-left bg-blue-600 text-white hover:bg-blue-700"
            }
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
        {/* Logo Image */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://qbjgfnlpmcyxjxopsnvt.supabase.co/storage/v1/object/public/service_providers_other/logo.png"
            alt="MoService Logo"
            width={40}      // small logo width
            height={40}     // small logo height
            className="object-contain"
          />
          <span className="text-2xl font-bold text-gray-900">MoService</span>
        </Link>

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
