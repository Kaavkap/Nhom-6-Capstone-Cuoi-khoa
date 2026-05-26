'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin } from 'lucide-react';
import Button from '@/components/common/Button';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="py-12 bg-transparent min-h-screen">
      <div className="container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <h1 className="text-8xl font-black text-gray-900 uppercase tracking-tighter leading-tight">
              {t('contact.get_in', 'Get in')} <br /> <span className="text-[#06BBCC]">{t('contact.touch', 'Touch')}</span>
            </h1>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6 p-8 border-4 border-gray-900 bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Mail className="text-[#06BBCC]" size={32} />
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('contact.email_us', 'Email Us')}</p>
                  <p className="text-2xl font-black text-gray-900">hello@cyberedu.vn</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 p-8 border-4 border-gray-900 bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <MapPin className="text-[#06BBCC]" size={32} />
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('contact.visit_us', 'Visit Us')}</p>
                  <p className="text-2xl font-black text-gray-900">123 Tech Street, Saigon</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border-8 border-gray-900 p-12 shadow-[20px_20px_0px_0px_rgba(6,187,204,0.3)]"
          >
            <h3 className="text-3xl font-black mb-10 uppercase tracking-tight">{t('contact.send_message', 'Send a Message')}</h3>
            <div className="space-y-8">
              <input type="text" placeholder={t('contact.your_name', 'YOUR NAME')} className="w-full bg-gray-50 border-4 border-gray-900 p-5 font-black focus:outline-none focus:bg-white transition-colors" />
              <input type="email" placeholder={t('contact.your_email', 'YOUR EMAIL')} className="w-full bg-gray-50 border-4 border-gray-900 p-5 font-black focus:outline-none focus:bg-white transition-colors" />
              <textarea placeholder={t('contact.your_message', 'YOUR MESSAGE')} rows={4} className="w-full bg-gray-50 border-4 border-gray-900 p-5 font-black focus:outline-none focus:bg-white transition-colors resize-none"></textarea>
              <Button className="w-full py-6 text-xl font-black rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                {t('contact.send_btn', 'SEND MESSAGE')}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
