"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SiteHeaderProps } from "./SiteHeader";
import Link from "next/link";
import Image from "next/image";

export const HeaderClient = ({ logoUrl, links }: SiteHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src={logoUrl} alt="Nutrapreps Logo" width={80} height={80} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              className="text-gray-600 hover:text-green-600 transition duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="/puck" className="text-gray-600 hover:text-green-600 transition duration-300">
            Login
          </a>
          <a href="#" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300">
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          {links.map((link, i) => (
             <a key={i} href={link.url} className="block text-gray-600 hover:text-green-600">
                {link.label}
             </a>
          ))}
          <hr className="my-2" />
          <a href="/puck" className="block text-gray-600 hover:text-green-600">
            Login
          </a>
          <a href="#" className="block bg-green-600 text-white text-center px-4 py-2 rounded-full hover:bg-green-700">
            Get Started
          </a>
        </div>
      )}
    </header>
  );
};
