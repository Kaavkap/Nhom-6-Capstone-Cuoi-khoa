'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Star,
  Users,
  PlayCircle,
  ChevronRight,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import courseService from '@/services/courseService';
import useAuthStore from '@/store/useAuthStore';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import toast from 'react-hot-toast';

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { currentUser } = useAuthStore();
  const hasMounted = useHasMounted();
  const { course, loading } = useCourseDetail(id);

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = async () => {
    if (!currentUser) {
      toast.error('Please login to enroll!');
      router.push('/login');
      return;
    }
    if (!course) return;
    try {
      setIsEnrolling(true);
      await courseService.enrollCourse(course.maKhoaHoc, currentUser.taiKhoan);
      setEnrolled(true);
      toast.success(t('courseDetail.enrollSuccess', 'Enrolled successfully!'), {
        style: { border: '2px solid #06BBCC', padding: '16px', color: '#333', background: '#fff' },
        iconTheme: { primary: '#06BBCC', secondary: '#fff' },
      });
    } catch (error: unknown) {
      const errorMsg =
        (error as { response?: { data?: string } }).response?.data ||
        t('courseDetail.enrollFail', 'Failed to enroll in course');
      toast.error(errorMsg);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (!hasMounted) return null;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#06BBCC] border-t-transparent rounded-none animate-spin" />
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Course Not Found</h1>
        <button
          onClick={() => router.push('/courses')}
          className="rounded-none px-8 py-3 font-bold text-sm border-2 border-gray-900 bg-transparent text-gray-900 hover:bg-gray-100 transition-colors"
        >
          Back to Courses
        </button>
      </div>
    );

  const curriculum = [
    'Introduction and Setup',
    'Core Fundamentals',
    'Advanced Concepts',
    'Project Development',
    'Optimization and Best Practices',
    'Testing and Deployment',
    'Final Certification',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white pt-20"
    >
      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-r from-[#058e9b] to-[#111] text-white py-14 border-b-4 border-[#06BBCC]">
        <div className="container mx-auto px-6 md:px-12">

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-6"
          >
            <span
              className="hover:text-[#06BBCC] cursor-pointer transition-colors"
              onClick={() => router.push('/')}
            >
              {t('courseDetail.home', 'HOME')}
            </span>
            <ChevronRight size={12} />
            <span
              className="hover:text-[#06BBCC] cursor-pointer transition-colors"
              onClick={() => router.push('/courses')}
            >
              {t('courseDetail.courses', 'COURSES')}
            </span>
            <ChevronRight size={12} />
            <span className="text-[#06BBCC] truncate max-w-[180px]">{course.tenKhoaHoc}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-2xl md:text-3xl font-bold tracking-tight leading-snug max-w-3xl mb-4"
          >
            {course.tenKhoaHoc}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-sm leading-relaxed text-gray-300 max-w-2xl mb-8 font-normal"
          >
            {course.moTa || 'Elevate your professional skills with this comprehensive course designed by industry experts.'}
          </motion.p>

          {/* Meta badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-yellow-400" size={14} />
              ))}
              <span className="font-bold text-sm ml-1">4.9</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Users className="text-[#06BBCC]" size={14} />
              <span>{course.soLuongHocVien} {t('courseDetail.studentsEnrolled', 'Students')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{t('courseDetail.createdBy', 'Created by')}</span>
              <span className="font-semibold text-[#06BBCC]">{course.nguoiTao.hoTen}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Left: Main Content ── */}
          <div className="lg:col-span-2 space-y-12">

            {/* Description */}
            <section>
              <h2 className="text-lg font-bold border-b pb-3 mb-5 text-gray-900 tracking-tight">
                {t('courseDetail.overview', 'Mô tả khóa học')}
              </h2>
              <div className="text-sm leading-loose text-gray-600 space-y-4">
                <p>{course.moTa || 'No description available.'}</p>
              </div>
            </section>

            {/* Curriculum */}
            <section>
              <h2 className="text-lg font-bold border-b pb-3 mb-5 text-gray-900 tracking-tight">
                {t('courseDetail.curriculum', 'Nội dung khóa học')}
              </h2>
              <div className="space-y-3">
                {curriculum.map((lesson, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3.5 px-5 bg-white border border-gray-100 hover:border-[#06BBCC] transition-all cursor-pointer group shadow-[2px_2px_0px_0px_rgba(0,0,0,0.04)] hover:shadow-[4px_4px_0px_0px_rgba(6,187,204,0.08)] mb-1"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-50 flex items-center justify-center text-[#06BBCC] text-xs font-bold group-hover:bg-[#06BBCC] group-hover:text-white transition-all border border-gray-100">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-800 group-hover:text-[#06BBCC] transition-colors">
                        {lesson}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <PlayCircle className="text-gray-300 group-hover:text-[#06BBCC]" size={18} />
                      <span className="text-xs font-semibold text-gray-400">15:00</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Right: Sticky Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">

              {/* Card */}
              <div
                className="bg-white border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,0.08)] overflow-hidden rounded-none flex flex-col"
                style={{ minHeight: '580px' }}
              >

                {/* Thumbnail */}
                <div className="relative aspect-video group cursor-pointer overflow-hidden border-b-2 border-gray-900">
                  <Image
                    src={course.hinhAnh}
                    alt={course.tenKhoaHoc}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 bg-white flex items-center justify-center border-2 border-gray-900">
                      <PlayCircle className="text-[#06BBCC]" size={28} />
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="p-8 space-y-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-gray-900 tracking-tight">
                      {t('courseDetail.free', 'FREE')}
                    </span>
                    <span className="text-sm text-gray-400 line-through font-semibold">$199.99</span>
                  </div>

                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling || enrolled}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      border: enrolled ? '2px solid #16a34a' : '2px solid #111',
                      boxShadow: enrolled ? 'none' : '4px 4px 0px 0px rgba(0,0,0,0.9)',
                      backgroundColor: enrolled ? '#22c55e' : '#06BBCC',
                      color: '#ffffff',
                      cursor: enrolled ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {isEnrolling ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: 16, height: 16,
                            border: '2px solid #ffffff',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'spin 0.7s linear infinite',
                          }}
                        />
                        Enrolling...
                      </span>
                    ) : enrolled ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                        <CheckCircle2 size={18} color="#fff" />
                        {t('courseDetail.alreadyEnrolled', 'ENROLLED ✓')}
                      </span>
                    ) : (
                      t('courseDetail.enrollNow', "ENROLL NOW — IT'S FREE")
                    )}
                  </button>

                  {/* Perks */}
                  <div className="space-y-5 pt-6 border-t border-gray-100">
                    {[
                      { icon: <Clock size={16} className="text-[#06BBCC]" />, label: t('courseDetail.lifetime', 'Lifetime Access') },
                      { icon: <BookOpen size={16} className="text-[#06BBCC]" />, label: `48 ${t('courseDetail.lessons', 'Lessons')}` },
                      { icon: <Award size={16} className="text-[#06BBCC]" />, label: t('courseDetail.certificate', 'Certificate of Completion') },
                    ].map(({ icon, label }) => (
                      <div key={label} className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                        {icon}
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category chip */}
              <div className="bg-gray-900 p-5 border-2 border-gray-900 shadow-[6px_6px_0px_0px_rgba(6,187,204,0.25)]">
                <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-gray-400">
                  {t('courseDetail.category', 'Category')}
                </h4>
                <div className="inline-block bg-[#06BBCC] text-white px-5 py-2 font-bold text-xs tracking-widest border border-white/20">
                  {course.danhMucKhoaHoc.tenDanhMucKhoaHoc.toUpperCase()}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
