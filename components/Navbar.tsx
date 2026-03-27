"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* A simple green circle to represent the eco-focus */}
          <div className="w-8 h-8 bg-[#2E7D32] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">ES</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1A1C19]">Emission-Sense</span>
        </Link>
        
        <nav className="flex items-center gap-4">
          <a 
            href="https://github.com/BinaryxBeast/Emission-Sense" 
            target="_blank" 
            rel="noreferrer"
            className="hidden md:block text-sm font-medium text-gray-600 hover:text-[#2E7D32] transition-colors"
          >
            GitHub
          </a>
          <button className="px-6 py-2.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-sm font-semibold hover:bg-[#C8E6C9] transition-colors">
            Calculate Now
          </button>
        </nav>
      </div>
    </header>
  );
}