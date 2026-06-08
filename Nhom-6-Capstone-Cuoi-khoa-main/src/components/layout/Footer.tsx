'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Globe, Users } from 'lucide-react';

import { useHasMounted } from '@/hooks/useHasMounted';

export default function Footer() {
  const { t } = useTranslation();
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12 border-t-[8px] border-[#06BBCC]">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <Link href="/" className="text-4xl font-black text-[#06BBCC] tracking-tighter">
              CyberEdu
            </Link>
            <p className="text-gray-400 font-bold leading-relaxed">
              Empowering the next generation of tech leaders through world-class education and real-world projects.
            </p>
            <div className="flex gap-4">
              {[Globe, Users, Mail, Phone].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-gray-800 flex items-center justify-center hover:bg-[#06BBCC] transition-all border-2 border-transparent hover:border-white">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-black mb-10 uppercase tracking-widest border-b-2 border-[#06BBCC] inline-block pb-2">Quick Links</h4>
            <ul className="space-y-4 font-bold text-gray-400">
              <li><Link href="/courses" className="hover:text-[#06BBCC] transition-colors flex items-center gap-2"><span className="w-2 h-2 bg-[#06BBCC]"></span> {t('header.courses')}</Link></li>
              <li><Link href="/about" className="hover:text-[#06BBCC] transition-colors flex items-center gap-2"><span className="w-2 h-2 bg-[#06BBCC]"></span> {t('header.about')}</Link></li>
              <li><Link href="/contact" className="hover:text-[#06BBCC] transition-colors flex items-center gap-2"><span className="w-2 h-2 bg-[#06BBCC]"></span> {t('header.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-black mb-10 uppercase tracking-widest border-b-2 border-[#06BBCC] inline-block pb-2">Contact Info</h4>
            <ul className="space-y-6 font-bold text-gray-400">
              <li className="flex items-center gap-4"><MapPin className="text-[#06BBCC]" size={20} /> 123 Tech Street, Saigon</li>
              <li className="flex items-center gap-4"><Phone className="text-[#06BBCC]" size={20} /> +84 123 456 789</li>
              <li className="flex items-center gap-4"><Mail className="text-[#06BBCC]" size={20} /> hello@cyberedu.vn</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-black mb-10 uppercase tracking-widest border-b-2 border-[#06BBCC] inline-block pb-2">Newsletter</h4>
            <div className="space-y-4">
              <input type="email" placeholder="YOUR EMAIL" className="w-full bg-gray-800 border-2 border-gray-700 p-4 font-black focus:border-[#06BBCC] outline-none transition-all" />
              <button className="w-full bg-[#06BBCC] py-4 font-black uppercase shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t-2 border-gray-800 text-center font-bold text-gray-500 uppercase tracking-widest text-sm">
          © {new Date().getFullYear()} CyberEdu. All rights reserved. Built for Cybersoft.
        </div>
      </div>
    </footer>
  );
}
