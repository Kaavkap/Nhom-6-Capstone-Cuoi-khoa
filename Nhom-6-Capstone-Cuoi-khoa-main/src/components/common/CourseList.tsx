'use client';

import React, { useEffect, useState } from 'react';
import courseService from '@/services/courseService';
import { Course } from '@/types/course';
import CourseCard from './CourseCard';

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourseList();
        // Limit to 8 courses for home page
        setCourses(data.slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse h-[450px] rounded-none"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      {courses.map((course) => (
        <CourseCard key={course.maKhoaHoc} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
