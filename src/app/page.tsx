'use client';

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  Globe,
  Home as HomeIcon,
  BookOpen,
  ArrowRight
} from "lucide-react";
import Button from "@/components/common/Button";
import useAuthStore from '@/store/useAuthStore';
import CourseList from "@/components/common/CourseList";
import { useHasMounted } from '@/hooks/useHasMounted';

export default function Home() {
  const { t } = useTranslation();
  const { currentUser } = useAuthStore();
  const hasMounted = useHasMounted();

  const featuresList = [
    {
      icon: GraduationCap,
      title: t('features.skilled_instructors', "Skilled Instructors"),
      description: t('features.skilled_instructors_desc', "Learn from industry experts with years of practical experience.")
    },
    {
      icon: Globe,
      title: t('features.online_classes', "Online Classes"),
      description: t('features.online_classes_desc', "Access high-quality classes from anywhere in the world, at any time.")
    },
    {
      icon: HomeIcon,
      title: t('features.home_projects', "Home Projects"),
      description: t('features.home_projects_desc', "Build real-world projects that help you master your skills faster.")
    },
    {
      icon: BookOpen,
      title: t('features.book_library', "Book Library"),
      description: t('features.book_library_desc', "Get unlimited access to a vast library of digital learning resources.")
    }
  ];

  if (!hasMounted) return null;

  return (
    <div className="flex flex-col gap-y-20 w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative hero-gradient min-h-[85vh] flex items-center overflow-hidden pt-24 lg:pt-0">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-8"
          >
            <h5 className="text-[#06BBCC] uppercase font-black tracking-[0.3em] flex items-center gap-3">
              <span className="w-10 h-[3px] bg-[#06BBCC]"></span>
              {t('hero.subtitle', 'WELCOME TO CYBEREDU')}
            </h5>
            <h1 className="text-6xl lg:text-8xl font-black leading-[1] tracking-tighter">
              {t('hero.title', 'Master Your Future With Technology')}
            </h1>
            <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
              {t('hero.description', 'Join over 100,000+ students learning the most in-demand skills in software development, AI, and design.')}
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              {currentUser ? (
                <Link href="/courses">
                  <Button className="px-10 py-8 text-xl font-black rounded-none shadow-xl hover:shadow-[#06BBCC]/40">
                    {t('hero.explore', 'EXPLORE COURSES')} <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
              ) : (
                <Link href="/register">
                  <Button className="px-10 py-8 text-xl font-black rounded-none shadow-xl hover:shadow-[#06BBCC]/40">
                    {t('hero.join', 'JOIN NOW')} <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </Link>
              )}
              <Link href="/about">
                <Button variant="outline" className="px-10 py-8 text-xl font-black rounded-none text-white border-white hover:bg-white hover:text-gray-900 border-2">
                  {t('hero.readMore', 'READ MORE')}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 border-[12px] border-white/10 aspect-video overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                alt="Learning Platform"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuresList.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-12 border-b-4 border-[#06BBCC] shadow-sm hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="mb-8 p-5 bg-gray-50 inline-block group-hover:bg-[#06BBCC] transition-all rounded-sm">
                  <feature.icon className="w-10 h-10 text-[#06BBCC] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course List Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-center mt-24 mb-20 w-full block">
            <div className="flex-grow border-t-8 border-gray-900"></div>
            <h2 className="mx-2 text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase">
              {t('home.courses_subtitle', 'Popular Courses')}
            </h2>
            <div className="flex-grow border-t-8 border-gray-900"></div>
          </div>

          <div className="pt-12">
            <CourseList />
          </div>

          <div className="mt-20 text-center">
            <Link href="/courses">
              <Button className="px-12 py-5 text-xl font-black rounded-none shadow-xl">
                VIEW ALL COURSES <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
