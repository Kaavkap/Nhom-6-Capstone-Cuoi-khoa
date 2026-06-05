'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminLinks = [
  { href: '/admin/users', label: 'QUAN LY NGUOI DUNG' },
  { href: '/admin/courses', label: 'QUAN LY KHOA HOC' },
  { href: '/admin/enrollments', label: 'QUAN LY GHI DANH' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-6 lg:px-10 py-10 space-y-6">
      <div className="bg-black text-white border-4 border-black px-6 py-7 lg:px-8 lg:py-8 shadow-[10px_10px_0px_0px_#06BBCC]">
        <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tight leading-none">ADMIN DASHBOARD</h1>
        <p className="text-sm lg:text-base font-bold uppercase tracking-wider text-gray-300 mt-3">
          QUAN TRI HE THONG E-LEARNING
        </p>
      </div>

      <div className="border-4 border-black bg-white p-4 lg:p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`min-h-[60px] px-5 py-4 border-4 border-black text-sm lg:text-base font-black uppercase tracking-wide transition-all flex items-center justify-center text-center ${
                isActive
                  ? 'bg-[#06BBCC] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        </div>
      </div>

      {children}
    </div>
  );
}
