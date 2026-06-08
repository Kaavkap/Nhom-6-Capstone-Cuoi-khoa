'use client';

import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import courseService from '@/services/courseService';
import { userService } from '@/services/userService';
import useAuthStore from '@/store/useAuthStore';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import toast from 'react-hot-toast';
import styles from './course-detail.module.scss';

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { currentUser } = useAuthStore();
  const hasMounted = useHasMounted();
  const { course, loading } = useCourseDetail(id);
  const courseId = course?.maKhoaHoc;

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const syncEnrollmentStatus = async () => {
      if (!currentUser || !courseId) {
        setEnrolled(false);
        return;
      }

      try {
        const profile = await userService.getProfile();
        const isAlreadyEnrolled = profile.chiTietKhoaHocGhiDanh?.some(
          (enrolledCourse) => enrolledCourse.maKhoaHoc === courseId
        );
        setEnrolled(Boolean(isAlreadyEnrolled));
      } catch {
        setEnrolled(false);
      }
    };

    syncEnrollmentStatus();
  }, [currentUser, courseId]);

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
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );

  if (!course)
    return (
      <div className={styles.notFoundContainer}>
        <div className={styles.notFoundCard}>
          <h1>Course Not Found</h1>
          <button onClick={() => router.push('/courses')}>
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
      className={styles.pageContainer}
    >
      {/* ── HERO BANNER ── */}
      <div className={styles.heroBanner}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <span onClick={() => router.push('/')}>
              {t('courseDetail.home', 'HOME')}
            </span>
            <ChevronRight size={12} />
            <span onClick={() => router.push('/courses')}>
              {t('courseDetail.courses', 'COURSES')}
            </span>
            <ChevronRight size={12} />
            <span className={styles.active}>{course.tenKhoaHoc}</span>
          </div>

          <h1>{course.tenKhoaHoc}</h1>

          <div className={styles.metaData}>
            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} />
              ))}
              <span>4.9</span>
            </div>
            <div className={styles.students}>
              <Users size={14} />
              <span>{course.soLuongHocVien} {t('courseDetail.studentsEnrolled', 'Students')}</span>
            </div>
            <div className={styles.creator}>
              <span>{t('courseDetail.createdBy', 'Created by')} :</span>
              <span className={styles.name}>{course.nguoiTao?.hoTen || 'ADMIN'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className={styles.mainBody}>
        <div className={styles.gridContainer}>

          {/* LEFT CONTENT */}
          <div className={styles.leftContent}>
            <section className={styles.contentSection}>
              <h2>{t('courseDetail.overview', 'Mô tả khóa học')}</h2>
              <div className={styles.description}>
                <p>{course.moTa || 'No description available for this course syllabus.'}</p>
              </div>
            </section>

            <section className={styles.contentSection}>
              <h2>{t('courseDetail.curriculum', 'Nội dung khóa học')}</h2>
              <div className={styles.curriculumList}>
                {curriculum.map((lesson, i) => (
                  <div key={i} className={styles.lessonItem}>
                    <div className={styles.lessonTitle}>
                      <div className={styles.lessonNumber}>{i + 1}</div>
                      <span>{lesson}</span>
                    </div>
                    <div className={styles.lessonMeta}>
                      <PlayCircle size={16} />
                      <span>15:00 MINS</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className={styles.rightSidebar}>
            <div className={styles.stickyContainer}>
              <div className={styles.courseCard}>
                <div className={styles.imageContainer}>
                  <Image
                    src={course.hinhAnh}
                    alt={course.tenKhoaHoc}
                    fill
                    unoptimized
                  />
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.priceSection}>
                    <span className={styles.freeText}>{t('courseDetail.free', 'FREE ACCESS')}</span>
                    <span className={styles.originalPrice}>$199.99</span>
                  </div>

                  <button
                    onClick={enrolled ? handleCancelEnrollment : handleEnroll}
                    disabled={isEnrolling}
                    className={`${styles.enrollButton} ${enrolled ? styles.isEnrolled : styles.notEnrolled}`}
                  >
                    {isEnrolling ? (
                      <span>PROCESSING...</span>
                    ) : enrolled ? (
                      <span>❌ CANCEL ENROLLMENT</span>
                    ) : (
                      <span>⚡ ENROLL NOW — IT&apos;S FREE</span>
                    )}
                  </button>

                  <div className={styles.featuresList}>
                    {[
                      { icon: <Clock size={16} />, label: t('courseDetail.lifetime', 'Lifetime Access') },
                      { icon: <BookOpen size={16} />, label: `48 Custom Full ${t('courseDetail.lessons', 'Lessons')}` },
                      { icon: <Award size={16} />, label: t('courseDetail.certificate', 'Certificate of Completion') },
                    ].map(({ icon, label }) => (
                      <div key={label} className={styles.featureItem}>
                        <div className={styles.iconBox}>{icon}</div>
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
