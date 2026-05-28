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
        style: { border: '4px solid #000', padding: '16px', color: '#000', background: '#fff', fontWeight: '900' },
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

  const handleCancelEnrollment = async () => {
    if (!currentUser || !course) return;
    try {
      setIsEnrolling(true);
      await courseService.cancelEnrollment(course.maKhoaHoc, currentUser.taiKhoan);
      setEnrolled(false);
      toast.success(t('courseDetail.cancelSuccess', 'Canceled enrollment successfully!'), {
        style: { border: '4px solid #000', padding: '16px', color: '#000', background: '#fff', fontWeight: '900' },
        iconTheme: { primary: '#e11d48', secondary: '#fff' },
      });
    } catch (error: unknown) {
      const errorMsg =
        (error as { response?: { data?: string } }).response?.data ||
        t('courseDetail.cancelFail', 'Failed to cancel enrollment');
      toast.error(errorMsg);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (!hasMounted) return null;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-black border-t-[#06BBCC] rounded-none animate-spin" />
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <div className="border-4 border-black p-10 bg-white text-center max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4">Course Not Found</h1>
          <button
            onClick={() => router.push('/courses')}
            className="w-full border-4 border-black bg-[#06BBCC] text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Back to Courses
          </button>
        </div>
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
      className="bg-white pt-24 min-h-screen"
    >
      {/* ── HERO BANNER ── */}
      <div className="bg-black text-white py-12 border-b-4 border-black">
        <div className="container mx-auto px-8 max-w-7xl">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">
            <span className="hover:text-[#06BBCC] cursor-pointer transition-colors" onClick={() => router.push('/')}>
              {t('courseDetail.home', 'HOME')}
            </span>
            <ChevronRight size={12} className="text-gray-600" />
            <span className="hover:text-[#06BBCC] cursor-pointer transition-colors" onClick={() => router.push('/courses')}>
              {t('courseDetail.courses', 'COURSES')}
            </span>
            <ChevronRight size={12} className="text-gray-600" />
            <span className="text-[#06BBCC] truncate max-w-[200px]">{course.tenKhoaHoc}</span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight max-w-4xl mb-4">
            {course.tenKhoaHoc}
          </h1>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-6 pt-4 border-t border-gray-800">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-yellow-400" size={14} />
              ))}
              <span className="font-black text-xs ml-2 bg-[#06BBCC] text-black px-1.5 py-0.5">4.9</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300">
              <Users className="text-[#06BBCC]" size={14} />
              <span>{course.soLuongHocVien} {t('courseDetail.studentsEnrolled', 'Students')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
              <span>{t('courseDetail.createdBy', 'Created by')} :</span>
              <span className="font-black text-[#06BBCC]">{course.nguoiTao?.hoTen || 'ADMIN'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="container mx-auto px-8 max-w-7xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white border-4 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_#06BBCC]">
              <h2 className="text-sm font-black uppercase tracking-widest border-b-4 border-black pb-3 mb-6 text-black">
                {t('courseDetail.overview', 'Mô tả khóa học')}
              </h2>
              <div className="text-xs leading-relaxed font-medium text-black space-y-4 whitespace-pre-line">
                <p>{course.moTa || 'No description available for this course syllabus.'}</p>
              </div>
            </section>

            <section className="bg-white border-4 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_#06BBCC]">
              <h2 className="text-sm font-black uppercase tracking-widest border-b-4 border-black pb-3 mb-6 text-black">
                {t('courseDetail.curriculum', 'Nội dung khóa học')}
              </h2>
              <div className="space-y-4">
                {curriculum.map((lesson, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border-2 border-black hover:bg-gray-50 transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-black shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-xs font-black uppercase tracking-tight text-black">{lesson}</span>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-dashed border-gray-200">
                      <PlayCircle className="text-black" size={16} />
                      <span className="text-[11px] font-black tracking-wider text-gray-500">15:00 MINS</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#06BBCC] flex flex-col">
                <div className="relative aspect-video border-b-4 border-black bg-gray-100 overflow-hidden">
                  <Image
                    src={course.hinhAnh}
                    alt={course.tenKhoaHoc}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="p-6 md:p-8 space-y-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-black">
                    <span className="text-2xl font-black text-black tracking-tighter uppercase">
                      {t('courseDetail.free', 'FREE ACCESS')}
                    </span>
                    <span className="text-xs text-gray-400 line-through font-bold">$199.99</span>
                  </div>

                  {/* FIXED ENROLL BUTTON (Invisible text bug completely fixed via text-black) */}
                  <button
                    onClick={enrolled ? handleCancelEnrollment : handleEnroll}
                    disabled={isEnrolling}
                    className={`w-full h-16 text-xs font-black uppercase tracking-widest border-4 border-black transition-all flex items-center justify-center gap-2 shadow-none ${
                      enrolled 
                        ? 'bg-white text-red-600 hover:bg-red-100' 
                        : 'bg-[#06BBCC] text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {isEnrolling ? (
                      <span>PROCESSING...</span>
                    ) : enrolled ? (
                      <span>❌ CANCEL ENROLLMENT</span>
                    ) : (
                      <span>⚡ ENROLL NOW — IT'S FREE</span>
                    )}
                  </button>

                  <div className="space-y-4 pt-4">
                    {[
                      { icon: <Clock size={16} />, label: t('courseDetail.lifetime', 'Lifetime Access') },
                      { icon: <BookOpen size={16} />, label: `48 Custom Full ${t('courseDetail.lessons', 'Lessons')}` },
                      { icon: <Award size={16} />, label: t('courseDetail.certificate', 'Certificate of Completion') },
                    ].map(({ icon, label }) => (
                      <div key={label} className="flex items-center gap-3 text-black text-xs font-black uppercase tracking-tight">
                        <div className="w-6 h-6 border-2 border-black flex items-center justify-center bg-gray-50 shrink-0">
                          {icon}
                        </div>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}