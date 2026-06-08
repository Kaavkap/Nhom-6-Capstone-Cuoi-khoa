'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import courseService from '@/services/courseService';
import CourseCard from '@/components/common/CourseCard';
import { Course, CourseCategory } from '@/types/course';

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 text-xs font-black tracking-widest text-black animate-pulse">LOADING...</div>}>
      <CoursesPageContent />
    </Suspense>
  );
}

function CoursesPageContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function loadAllCourses() {
    setIsLoading(true);
    try {
      const data = await courseService.getCourseList();
      setCourses(data);
    } catch (err) {
      console.error("Error loading all courses:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Load categories and initial courses catalog
  useEffect(() => {
    const initData = async () => {
      try {
        const catData = await courseService.getCategories();
        setCategories(catData);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
      await loadAllCourses();
    };
    initData();
  }, []);

  // Handle Category Filter Selection
  const handleCategoryClick = async (id: string) => {
    setActiveCategory(id);
    setIsLoading(true);
    try {
      if (id === 'All') {
        await loadAllCourses();
      } else {
        const data = await courseService.getCoursesByCategory(id);

        const normalizedData: Course[] = (data || []).map((course: Course) => ({
          ...course,
          tenKhoaHoc: course.tenKhoaHoc,
          moTa: course.moTa || "Chưa có mô tả chi tiết cho khóa học này.",
          hinhAnh: course.hinhAnh
        }));

        setCourses(normalizedData);
      }
    } catch (err) {
      console.error("Error filtering courses:", err);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    if (!searchQuery) return true;
    return (
      course.tenKhoaHoc?.toLowerCase().includes(searchQuery) ||
      course.moTa?.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <div className="container mx-auto py-16 px-8 max-w-7xl pt-28">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">

        {/* SIDEBAR DANH MỤC KHÓA HỌC */}
        <div className="lg:col-span-1 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-28 z-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-black mb-6 pb-3 border-b-4 border-black">
            Danh mục khóa học
          </h3>

          <div className="flex flex-col gap-4">
            {/* 'ALL' FILTER OPTION CARD */}
            <button
              onClick={() => handleCategoryClick('All')}
              className={`w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest border-2 border-black transition-all duration-200 block ${activeCategory === 'All'
                ? '!bg-black !text-white translate-x-1 translate-y-1 shadow-none'
                : 'bg-white text-black hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
            >
              📚 Tất cả khóa học
            </button>

            {/* DYNAMIC CATEGORY OPTION CARDS */}
            {categories.map((cat) => (
              <button
                key={cat.maDanhMuc}
                onClick={() => handleCategoryClick(cat.maDanhMuc)}
                className={`w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest border-2 border-black transition-all duration-200 block ${activeCategory === cat.maDanhMuc
                  ? '!bg-black !text-white translate-x-1 translate-y-1 shadow-none'
                  : 'bg-white text-black hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  }`}
              >
                🖥️ {cat.tenDanhMuc}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Main Course Display Catalog Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="text-center py-24 text-xs font-black tracking-widest text-black animate-pulse">
              LOADING SYSTEM CHANNELS...
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.maKhoaHoc} course={course} />
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-24 font-black text-xs uppercase tracking-widest text-gray-400 border-4 border-dashed border-black bg-gray-50">
                  {searchQuery 
                    ? `Không tìm thấy khóa học nào phù hợp với "${searchQuery}"`
                    : 'Không tìm thấy khóa học nào thuộc danh mục này.'}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
