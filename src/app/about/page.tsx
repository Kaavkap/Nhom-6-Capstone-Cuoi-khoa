'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { useHasMounted } from '@/hooks/useHasMounted';

export default function AboutPage() {
  const { t } = useTranslation();
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  return (
    <div className="py-12 bg-transparent min-h-screen">
      <div className="container mx-auto px-6 lg:px-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto border-8 border-gray-900 p-16 shadow-[20px_20px_0px_0px_rgba(6,187,204,1)]"
        >
          <h1 className="text-7xl font-black text-gray-900 mb-8 uppercase tracking-tighter">
            {t('about.title', 'About Us')}
          </h1>
          <p className="text-3xl font-bold text-[#06BBCC] mb-10">{t('about.coming_soon', 'COMING SOON')}</p>
          <div className="text-left space-y-6 text-xl font-bold text-gray-600 leading-relaxed">
            <p>{t('about.desc_1', 'CyberEdu is the leading platform for technical education in Vietnam. We are currently redesigning this page to give you a better experience.')}</p>
            <div className="h-2 bg-gray-100 w-full"></div>
            <p>{t('about.desc_2', 'Stay tuned for more updates about our vision, our team, and our mission to empower the next generation of developers.')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
