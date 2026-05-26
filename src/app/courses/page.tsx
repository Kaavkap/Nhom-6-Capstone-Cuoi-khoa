'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import CourseCard from '@/components/common/CourseCard';
import courseService from '@/services/courseService';
import { useTranslation } from 'react-i18next';
import { useHasMounted } from '@/hooks/useHasMounted';
import { Course } from '@/types/course';

export default function CoursesPage() {
  const { t } = useTranslation();
  const hasMounted = useHasMounted();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourseList();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (!hasMounted) return null;

  const filteredCourses = courses.filter((course) => {
    if (!searchQuery) return true;
    return (
      course.tenKhoaHoc?.toLowerCase().includes(searchQuery) ||
      course.moTa?.toLowerCase().includes(searchQuery)
    );
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse h-[450px] rounded-none" />
        ))}
      </div>
    );
  }

  return (
    <div className="py-12 bg-transparent min-h-screen">
      <div className="container mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-black text-gray-900 mb-6 uppercase tracking-tighter border-b-8 border-[#06BBCC] inline-block">
            {t('header.courses', 'All Courses')}
          </h1>
          <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto font-bold">
            Explore our professional catalog of industry-leading courses.
          </p>
        </motion.div>
        {filteredCourses.length === 0 ? (
          <div className="text-center py-10 font-bold text-gray-500">
            Không tìm thấy khóa học nào phù hợp với "{searchQuery}"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.maKhoaHoc} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
