'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, Users, ArrowRight } from 'lucide-react';
import { Course } from '@/types/course';
import Button from './Button';
import { useTranslation } from 'react-i18next';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { t } = useTranslation();

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
  };

  const sanitizedDescription = stripHtml(course.moTa);

  const courseImage =
    course.hinhAnh && course.hinhAnh.startsWith('http')
      ? course.hinhAnh
      : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="bg-white border border-gray-100 group transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-full rounded-none min-h-[400px]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-50 border-b border-gray-100">
        <Image
          src={courseImage}
          alt={course.tenKhoaHoc}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop';
          }}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-[#06BBCC] text-white px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest z-10 border border-white/20">
          {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || 'TECH'}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-grow">

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-3 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <Users size={12} className="text-[#06BBCC]" />
            <span>{course.soLuongHocVien || 0} {t('home.students', 'Students')}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={12} className="text-[#06BBCC]" />
            <span>12 {t('home.lessonsCount', 'Lessons')}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold tracking-tight text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-[#06BBCC] transition-colors min-h-[2.5rem]">
          {course.tenKhoaHoc}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed font-normal line-clamp-3 flex-grow min-h-[50px]">
          {sanitizedDescription ||
            'Start learning today and master new skills with our expert instructors in this comprehensive course.'}
        </p>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-none bg-gray-50 flex items-center justify-center text-[9px] font-black text-[#06BBCC] border border-gray-100">
              {(course.nguoiTao?.hoTen || course.nguoiTao?.taiKhoan || 'A')
                .charAt(0)
                .toUpperCase()}
            </div>
            <span className="text-[10px] font-semibold text-gray-500 truncate max-w-[80px]">
              {course.nguoiTao?.hoTen || course.nguoiTao?.taiKhoan || 'Admin'}
            </span>
          </div>

          <Link href={`/courses/${course.maKhoaHoc}`}>
            <Button
              variant="ghost"
              className="px-0 py-0 text-[10px] uppercase tracking-wider font-black hover:bg-transparent hover:text-[#06BBCC] flex items-center gap-1 text-[#06BBCC] transition-all group/btn"
            >
              {t('home.viewDetail', 'VIEW DETAIL')}{' '}
              <ArrowRight size={11} className="transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
