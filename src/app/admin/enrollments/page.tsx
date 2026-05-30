'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@/components/common/Button';
import adminService from '@/services/adminService';
import { AdminCourseSearchResult, EnrollmentStudent } from '@/types/admin';

export default function AdminEnrollmentsPage() {
  const [courses, setCourses] = useState<AdminCourseSearchResult[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [unenrolledUsers, setUnenrolledUsers] = useState<EnrollmentStudent[]>([]);
  const [pendingUsers, setPendingUsers] = useState<EnrollmentStudent[]>([]);
  const [enrolledUsers, setEnrolledUsers] = useState<EnrollmentStudent[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const selectedCourse = useMemo(
    () => courses.find((course) => course.maKhoaHoc === selectedCourseId),
    [courses, selectedCourseId]
  );

  const loadCourses = useCallback(async () => {
    setIsLoadingCourses(true);
    setErrorMessage('');
    try {
      const data = await adminService.getCourses();
      setCourses(data);
      setSelectedCourseId((prev) => prev || data[0]?.maKhoaHoc || '');
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Không thể tải danh sách khóa học.';
      setErrorMessage(message);
    } finally {
      setIsLoadingCourses(false);
    }
  }, []);

  const loadEnrollmentData = useCallback(async (courseId: string) => {
    if (!courseId) return;
    setIsLoadingStudents(true);
    setErrorMessage('');
    try {
      const [unenrolled, pending, enrolled] = await Promise.all([
        adminService.getUnenrolledUsersByCourse(courseId),
        adminService.getPendingUsersByCourse(courseId),
        adminService.getEnrolledUsersByCourse(courseId),
      ]);
      setUnenrolledUsers(unenrolled);
      setPendingUsers(pending);
      setEnrolledUsers(enrolled);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Không thể tải dữ liệu ghi danh.';
      setErrorMessage(message);
      setUnenrolledUsers([]);
      setPendingUsers([]);
      setEnrolledUsers([]);
    } finally {
      setIsLoadingStudents(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCourses();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadCourses]);

  useEffect(() => {
    if (selectedCourseId) {
      const timer = setTimeout(() => {
        void loadEnrollmentData(selectedCourseId);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedCourseId, loadEnrollmentData]);

  const handleApprove = async (taiKhoan: string) => {
    if (!selectedCourseId) return;
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await adminService.approveEnrollment({ maKhoaHoc: selectedCourseId, taiKhoan });
      setSuccessMessage(`Ghi danh thành công cho tài khoản ${taiKhoan}.`);
      await loadEnrollmentData(selectedCourseId);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Ghi danh thất bại.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (taiKhoan: string) => {
    if (!selectedCourseId) return;
    const confirmed = window.confirm(`Hủy ghi danh của tài khoản "${taiKhoan}" cho khóa "${selectedCourseId}"?`);
    if (!confirmed) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await adminService.cancelEnrollment({ maKhoaHoc: selectedCourseId, taiKhoan });
      setSuccessMessage(`Hủy ghi danh thành công cho tài khoản ${taiKhoan}.`);
      await loadEnrollmentData(selectedCourseId);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Hủy ghi danh thất bại.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderUserCard = (
    title: string,
    users: EnrollmentStudent[],
    emptyText: string,
    actionLabel: string,
    actionType: 'approve' | 'cancel'
  ) => {
    return (
      <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-3 mb-4">{title}</h3>
        {users.length === 0 ? (
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 py-8 text-center">
            {emptyText}
          </p>
        ) : (
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {users.map((user) => (
              <div key={user.taiKhoan} className="border-2 border-black p-3 bg-gray-50">
                <p className="text-sm font-black">{user.taiKhoan}</p>
                <p className="text-xs text-gray-600">{user.hoTen || user.email || '-'}</p>
                <div className="pt-3">
                  {actionType === 'approve' ? (
                    <Button type="button" className="w-full py-2 px-3" isLoading={isSubmitting} onClick={() => handleApprove(user.taiKhoan)}>
                      {actionLabel}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="w-full py-2 px-3 bg-red-500 text-white border-red-700 hover:bg-black"
                      isLoading={isSubmitting}
                      onClick={() => handleCancel(user.taiKhoan)}
                    >
                      {actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-widest">Quản lý ghi danh theo khóa học</h2>
        <div className="flex gap-2">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="h-11 min-w-[260px] px-3 border-2 border-black text-sm font-bold bg-white"
            disabled={isLoadingCourses}
          >
            {courses.map((course) => (
              <option key={course.maKhoaHoc} value={course.maKhoaHoc}>
                {course.maKhoaHoc} - {course.tenKhoaHoc}
              </option>
            ))}
          </select>
          <Button type="button" variant="outline" onClick={() => loadEnrollmentData(selectedCourseId)}>
            Làm mới
          </Button>
        </div>
      </div>

      {selectedCourse && (
        <div className="border-2 border-black p-4 bg-gray-50">
          <p className="text-xs font-black uppercase tracking-widest mb-1">Khóa học đang chọn</p>
          <p className="text-sm font-bold">{selectedCourse.tenKhoaHoc}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 border-2 border-red-600 bg-red-50 text-red-700 text-xs font-black uppercase tracking-wide">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="p-3 border-2 border-green-600 bg-green-50 text-green-700 text-xs font-black uppercase tracking-wide">
          {successMessage}
        </div>
      )}

      {isLoadingStudents ? (
        <div className="border-2 border-black p-10 text-center text-xs font-black uppercase tracking-widest">
          Đang tải dữ liệu ghi danh...
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {renderUserCard(
            'Chưa ghi danh',
            unenrolledUsers,
            'Không có người dùng',
            'Ghi danh',
            'approve'
          )}

          {renderUserCard(
            'Chờ xét duyệt',
            pendingUsers,
            'Không có dữ liệu chờ',
            'Duyệt ghi danh',
            'approve'
          )}

          {renderUserCard(
            'Đã ghi danh',
            enrolledUsers,
            'Không có học viên',
            'Hủy ghi danh',
            'cancel'
          )}
        </div>
      )}
    </section>
  );
}
