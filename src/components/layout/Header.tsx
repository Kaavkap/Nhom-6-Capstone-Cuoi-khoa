'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  BookOpen,
  UserCircle,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import "@/i18n/config";
import { useHasMounted } from '@/hooks/useHasMounted';
import useAuthStore from '@/store/useAuthStore';
import Button from '@/components/common/Button';


export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const { currentUser, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const hasMounted = useHasMounted();
  const [scrolled, setScrolled] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!hasMounted) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsProfileOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { name: t('header.home'), href: '/' },
    { name: t('header.courses'), href: '/courses' },
    { name: t('header.about'), href: '/about' },
    { name: t('header.contact'), href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 border-gray-100 flex items-center ${scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm'
        : 'bg-white'
        }`}
      style={{ height: '80px' }}
    >
      <div className="container mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <span className="text-3xl font-black text-[#06BBCC] tracking-tighter group-hover:scale-105 transition-transform">
              CyberEdu
            </span>
          </Link>

          {/* Desktop Navigation - Task 13 Active State */}
          <nav className="hidden xl:flex items-center rounded-none h-14 ml-12">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <React.Fragment key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-base font-black transition-colors relative group px-12 flex items-center h-full uppercase tracking-tighter whitespace-nowrap ${isActive ? 'text-[#06BBCC]' : 'text-gray-800 hover:text-[#06BBCC]'
                      }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 h-1 bg-[#06BBCC] transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                  </Link>
                  {index < navLinks.length - 1 && (
                    <div className="w-[80px] h-6"></div>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Search & Icons & Auth */}
          <div className="hidden lg:flex items-center">

            {/* Refined Search Bar - Task 11 */}
            <div className="relative group hidden xl:block mr-12">
              <input
                type="text"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const query = e.currentTarget.value.trim();
                    router.push(`/courses${query ? `?search=${encodeURIComponent(query)}` : ''}`);
                  }
                }}
                className="peer pl-12 pr-4 py-3 w-[250px] bg-gray-50 border-2 border-gray-200 rounded-none text-base font-black transition-all focus:ring-0 focus:border-[#06BBCC] outline-none"
                placeholder="Search course"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#06BBCC] peer-focus:hidden" />
            </div>

            {/* Icons & Lang Switcher */}
            <div className="flex items-center gap-6">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-6 py-3 text-[#333] font-black hover:bg-gray-50 transition-all uppercase text-sm border-2 border-gray-200 rounded-none"
              >
                <Languages size={20} />
                {i18n.language}
              </button>
              <button className="p-3 text-[#333] hover:text-[#06BBCC] hover:bg-gray-50 rounded-none transition-all relative">
                <Bell size={26} />
                <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            {/* Auth Slot */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
                  className="flex items-center space-x-5 pl-5 pr-3 py-3 rounded-none hover:bg-gray-50 transition-all border border-gray-200"
                >
                  <div className="w-10 h-10 rounded-none bg-[#06BBCC] flex items-center justify-center text-white text-base font-bold">
                    {currentUser.hoTen.charAt(0)}
                  </div>
                  <span className="text-lg font-bold text-gray-800">
                    {currentUser.hoTen.split(' ').pop()}
                  </span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-4 min-w-[300px] bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] border-2 border-gray-200 py-0 overflow-hidden z-[60] rounded-none"
                    >
                      <div className="px-8 py-6 bg-gray-50 border-b-2 border-gray-200">
                        <p className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="text-lg font-black text-gray-900 truncate">{currentUser.email}</p>
                      </div>
                      <Link href="/profile" className="flex items-center space-x-6 px-8 py-6 hover:bg-[#06BBCC]/10 transition-colors group">
                        <UserCircle size={28} className="text-[#06BBCC] group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-black text-gray-800">{t('header.profile')}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-6 px-8 py-6 hover:bg-red-50 text-red-600 transition-colors border-t-2 border-gray-200 group"
                      >
                        <LogOut size={28} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-black">{t('header.logout')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-8">
                <Link href="/login">
                  <span className="text-lg font-bold text-gray-800 hover:text-[#06BBCC] transition-colors cursor-pointer">{t('header.signIn')}</span>
                </Link>
                <Link href="/register">
                  <Button className="text-lg font-bold px-10 py-4 rounded-none">{t('header.joinNow')}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-white z-[100] lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <span className="text-2xl font-black text-[#06BBCC]">CyberEdu</span>
                <button onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
              </div>
              <div className="p-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-2xl font-black text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-px bg-gray-100 my-4"></div>
                <button
                  onClick={() => { toggleLanguage(); setIsMenuOpen(false); }}
                  className="flex items-center gap-4 text-xl font-bold uppercase"
                >
                  <Languages size={24} />
                  Language: {i18n.language}
                </button>
                <div className="flex flex-col gap-4 pt-8">
                  {currentUser ? (
                    <button onClick={handleLogout} className="text-2xl font-black text-red-600 text-left">Logout</button>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full py-5 text-xl font-black rounded-none">Sign In</Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full py-5 text-xl font-black rounded-none">Join Now</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
