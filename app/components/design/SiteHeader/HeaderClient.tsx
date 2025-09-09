// app/components/design/SiteHeader/HeaderClient.tsx
"use client";

import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { SiteHeaderProps } from "./SiteHeader";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";

export const HeaderClient = ({ logoUrl, links }: SiteHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const cartItemCount = cartItems.length;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const formatUrl = (url: string) => {
    if (url.startsWith('#') && pathname !== '/') {
      return `/${url}`;
    }
    return url;
  };


  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {/* Added 'relative' to the parent div */}
          <div className="relative h-20 w-20"> 
            <Image 
              src={logoUrl} 
              alt="Nutrapreps Logo" 
              fill
              style={{ objectFit: 'contain' }}
              // Added sizes prop. The value depends on your design, but this is a good starting point.
              // This tells Next.js the image will take up to 20% of the viewport width.
              sizes="(max-width: 768px) 100vw, 20vw" 
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link, i) => (
            <a
              key={i}
              href={formatUrl(link.url)}
              className="text-gray-600 hover:text-green-600 transition duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Buttons & Cart */}
        <div className="hidden md:flex items-center space-x-4">
          {isClient && cartItemCount > 0 && (
            <Link href="/cart" className="relative text-gray-600 hover:text-green-600 transition duration-300 p-2">
              <ShoppingCart />
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            </Link>
          )}
          {session ? (
            <>
              <Link href="/account" className="text-gray-600 hover:text-green-600 transition duration-300">
                My Account
              </Link>
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:text-green-600 transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/signin"
              className="text-gray-600 hover:text-green-600 transition duration-300"
            >
              Login
            </a>
          )}
          <a href="/order" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300">
            Order
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4">
          {links.map((link, i) => (
             <a key={i} href={formatUrl(link.url)} className="block text-gray-600 hover:text-green-600">
                {link.label}
             </a>
          ))}
          <hr className="my-2" />
          {isClient && cartItemCount > 0 && (
            <Link href="/cart" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                <ShoppingCart size={20} />
                <span>View Cart ({cartItemCount})</span>
            </Link>
          )}
          {session ? (
            <>
             <Link href="/account" className="flex items-center gap-2 text-gray-600 hover:text-green-600">
                <User size={20} />
                <span>My Account</span>
             </Link>
            <button
              onClick={() => signOut()}
              className="block text-left w-full text-gray-600 hover:text-green-600"
            >
              Logout
            </button>
            </>
          ) : (
            <a
              href="/signin"
              className="block text-gray-600 hover:text-green-600"
            >
              Login
            </a>
          )}
          <a href="/order" className="block bg-green-600 text-white text-center px-4 py-2 rounded-full hover:bg-green-700">
            Order Now
          </a>
        </div>
      )}
    </header>
  );
};