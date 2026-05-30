'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@/components/common/Button';
import useAuthStore from '@/store/useAuthStore';
import adminService from '@/services/adminService';
import { CourseCategory } from '@/types/course';
import { AdminCoursePayload, AdminCourseSearchResult } from '@/types/admin';

const formatDate = (date: Date) => {
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const getCourseCategoryCode = (course: AdminCourseSearchResult) => {
  const category = course.danhMucKhoaHoc as { maDanhMucKhoahoc?: string; maDanhMucKhoaHoc?: string } | undefined;
  return category?.maDanhMucKhoaHoc || category?.maDanhMucKhoahoc || '';
};

export default function AdminCoursesPage() {
  const { currentUser } = useAuthStore();
  const [courses, setCourses] = useState<AdminCourseSearchResult[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<AdminCoursePayload>({
    maKhoaHoc: '',
    biDanh: '',
    tenKhoaHoc: '',
    moTa: '',
    luotXem: 0,
    danhGia: 0,
    hinhAnh: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80',
    maNhom: 'GP01',
    ngayTao: formatDate(new Date()),
    maDanhMucKhoaHoc: '',
    taiKhoanNguoiTao: '',
  });

  const tableCourses = useMemo(() => courses, [courses]);

  const resetForm = () => {
    setFormData({
      maKhoaHoc: '',
      biDanh: '',
      tenKhoaHoc: '',
      moTa: '',
      luotXem: 0,
      danhGia: 0,
      hinhAnh: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80',
      maNhom: 'GP01',
      ngayTao: formatDate(new Date()),
      maDanhMucKhoaHoc: categories[0]?.maDanhMuc || '',
      taiKhoanNguoiTao: currentUser?.taiKhoan || '',
    });
    setIsEdit(false);
  };

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [courseData, categoryData] = await Promise.all([
        adminService.getCourses(),
        adminService.getCourseCategories(),
      ]);
      setCourses(courseData);
      setCategories(categoryData);
      setFormData((prev) => ({
        ...prev,
        maDanhMucKhoaHoc: prev.maDanhMucKhoaHoc || categoryData[0]?.maDanhMuc || '',
        taiKhoanNguoiTao: prev.taiKhoanNguoiTao || currentUser?.taiKhoan || '',
      }));
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Không thể tải dữ liệu khóa học.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.taiKhoan]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadInitialData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadInitialData]);

  const handleSearch = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const keyword = searchValue.trim();
      if (!keyword) {
        const data = await adminService.getCourses();
        setCourses(data);
        return;
      }
      const data = await adminService.searchCourses(keyword);
      setCourses(data);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Không thể tìm kiếm khóa học.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (course: AdminCourseSearchResult) => {
    const categoryCode = getCourseCategoryCode(course);
    setFormData({
      maKhoaHoc: course.maKhoaHoc,
      biDanh: course.biDanh || slugify(course.tenKhoaHoc),
      tenKhoaHoc: course.tenKhoaHoc,
      moTa: course.moTa || '',
      luotXem: course.luotXem || 0,
      danhGia: 0,
      hinhAnh: course.hinhAnh || '',
      maNhom: course.maNhom || 'GP01',
      ngayTao: course.ngayTao || formatDate(new Date()),
      maDanhMucKhoaHoc: categoryCode,
      taiKhoanNguoiTao: course.nguoiTao?.taiKhoan || currentUser?.taiKhoan || '',
    });
    setIsEdit(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleDelete = async (maKhoaHoc: string) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa khóa học "${maKhoaHoc}"?`);
    if (!confirmed) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await adminService.deleteCourse(maKhoaHoc);
      setSuccessMessage('Xóa khóa học thành công.');
      const data = await adminService.getCourses();
      setCourses(data);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Xóa khóa học thất bại.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const payload: AdminCoursePayload = {
      ...formData,
      biDanh: formData.biDanh || slugify(formData.tenKhoaHoc),
      taiKhoanNguoiTao: formData.taiKhoanNguoiTao || currentUser?.taiKhoan || '',
    };

    try {
      if (isEdit) {
        await adminService.updateCourse(payload);
        setSuccessMessage('Cập nhật khóa học thành công.');
      } else {
        await adminService.addCourse(payload);
        setSuccessMessage('Thêm khóa học thành công.');
      }

      resetForm();
      const data = await adminService.getCourses();
      setCourses(data);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Không thể lưu khóa học.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
      <section className="xl:col-span-1 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-sm font-black uppercase tracking-widest border-b-4 border-black pb-3 mb-6">
          {isEdit ? 'Chỉnh sửa khóa học' : 'Thêm khóa học'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            disabled={isEdit}
            value={formData.maKhoaHoc}
            onChange={(e) => setFormData((prev) => ({ ...prev, maKhoaHoc: e.target.value }))}
            placeholder="Mã khóa học"
            className="w-full h-11 px-4 border-2 border-black text-sm font-bold disabled:bg-gray-100"
          />
          <input
            type="text"
            value={formData.biDanh}
            onChange={(e) => setFormData((prev) => ({ ...prev, biDanh: e.target.value }))}
            placeholder="Bí danh (để trống sẽ tự tạo)"
            className="w-full h-11 px-4 border-2 border-black text-sm font-bold"
          />
          <input
            type="text"
            required
            value={formData.tenKhoaHoc}
            onChange={(e) => setFormData((prev) => ({ ...prev, tenKhoaHoc: e.target.value }))}
            placeholder="Tên khóa học"
            className="w-full h-11 px-4 border-2 border-black text-sm font-bold"
          />
          <textarea
            required
            value={formData.moTa}
            onChange={(e) => setFormData((prev) => ({ ...prev, moTa: e.target.value }))}
            placeholder="Mô tả khóa học"
            className="w-full h-24 px-4 py-3 border-2 border-black text-sm font-bold resize-none"
          />
          <input
            type="text"
            value={formData.hinhAnh}
            onChange={(e) => setFormData((prev) => ({ ...prev, hinhAnh: e.target.value }))}
            placeholder="URL hình ảnh"
            className="w-full h-11 px-4 border-2 border-black text-sm font-bold"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={formData.luotXem}
              onChange={(e) => setFormData((prev) => ({ ...prev, luotXem: Number(e.target.value) }))}
              placeholder="Lượt xem"
              className="h-11 px-3 border-2 border-black text-sm font-bold"
            />
            <input
              type="number"
              value={formData.danhGia}
              onChange={(e) => setFormData((prev) => ({ ...prev, danhGia: Number(e.target.value) }))}
              placeholder="Đánh giá"
              className="h-11 px-3 border-2 border-black text-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={formData.maNhom}
              onChange={(e) => setFormData((prev) => ({ ...prev, maNhom: e.target.value }))}
              placeholder="Mã nhóm"
              className="h-11 px-3 border-2 border-black text-sm font-bold"
            />
            <input
              type="text"
              required
              value={formData.ngayTao}
              onChange={(e) => setFormData((prev) => ({ ...prev, ngayTao: e.target.value }))}
              placeholder="dd/MM/yyyy"
              className="h-11 px-3 border-2 border-black text-sm font-bold"
            />
          </div>

          <select
            value={formData.maDanhMucKhoaHoc}
            onChange={(e) => setFormData((prev) => ({ ...prev, maDanhMucKhoaHoc: e.target.value }))}
            className="w-full h-11 px-3 border-2 border-black text-sm font-bold bg-white"
          >
            {categories.map((category) => (
              <option key={category.maDanhMuc} value={category.maDanhMuc}>
                {category.tenDanhMuc}
              </option>
            ))}
          </select>

          <input
            type="text"
            required
            value={formData.taiKhoanNguoiTao}
            onChange={(e) => setFormData((prev) => ({ ...prev, taiKhoanNguoiTao: e.target.value }))}
            placeholder="Tài khoản người tạo"
            className="w-full h-11 px-4 border-2 border-black text-sm font-bold"
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" isLoading={isSubmitting}>
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            {isEdit && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Hủy sửa
              </Button>
            )}
          </div>
        </form>
      </section>

      <section className="xl:col-span-2 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-5">
          <h2 className="text-sm font-black uppercase tracking-widest">
            Danh sách khóa học
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm theo tên khóa học"
              className="h-11 min-w-[220px] px-4 border-2 border-black text-sm font-bold"
            />
            <Button type="button" onClick={handleSearch}>
              Tìm
            </Button>
            <Button type="button" variant="outline" onClick={loadInitialData}>
              Tải lại
            </Button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 border-2 border-red-600 bg-red-50 text-red-700 text-xs font-black uppercase tracking-wide">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 border-2 border-green-600 bg-green-50 text-green-700 text-xs font-black uppercase tracking-wide">
            {successMessage}
          </div>
        )}

        <div className="overflow-x-auto border-2 border-black">
          <table className="min-w-full text-sm">
            <thead className="bg-black text-white uppercase text-xs tracking-widest">
              <tr>
                <th className="text-left px-3 py-3">Mã KH</th>
                <th className="text-left px-3 py-3">Tên khóa học</th>
                <th className="text-left px-3 py-3">Danh mục</th>
                <th className="text-left px-3 py-3">Nhóm</th>
                <th className="text-left px-3 py-3">Lượt xem</th>
                <th className="text-left px-3 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center font-black text-xs uppercase tracking-widest">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : tableCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center font-black text-xs uppercase tracking-widest text-gray-500">
                    Không có dữ liệu khóa học
                  </td>
                </tr>
              ) : (
                tableCourses.map((course) => (
                  <tr key={course.maKhoaHoc} className="border-t border-black/20">
                    <td className="px-3 py-3 font-black">{course.maKhoaHoc}</td>
                    <td className="px-3 py-3">{course.tenKhoaHoc}</td>
                    <td className="px-3 py-3">{course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || '-'}</td>
                    <td className="px-3 py-3">{course.maNhom}</td>
                    <td className="px-3 py-3">{course.luotXem || 0}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="px-3 py-2" onClick={() => handleEdit(course)}>
                          Sửa
                        </Button>
                        <Button type="button" className="px-3 py-2 bg-red-500 text-white border-red-700 hover:bg-black" onClick={() => handleDelete(course.maKhoaHoc)}>
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
