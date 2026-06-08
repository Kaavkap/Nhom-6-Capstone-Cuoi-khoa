import { useState, useEffect } from 'react';
import courseService from '@/services/courseService';
import { Course } from '@/types/course';

export function useCourseDetail(id: string | string[] | undefined) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!id || typeof id !== 'string') return;
      
      try {
        setLoading(true);
        const data = await courseService.getCourseDetail(id);
        setCourse(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch course details:', err);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  return { course, loading, error };
}
