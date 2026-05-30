import apiInstance from './apiInstance';
import { Course, CourseCategory } from '@/types/course';
import {
  AdminCoursePayload,
  AdminCourseSearchResult,
  AdminUser,
  AdminUserPayload,
  EnrollmentPayload,
  EnrollmentStudent,
} from '@/types/admin';

const DEFAULT_GROUP = 'GP01';

const adminService = {
  getUsers: async (maNhom: string = DEFAULT_GROUP): Promise<AdminUser[]> => {
    const response = await apiInstance.get<AdminUser[]>('/QuanLyNguoiDung/LayDanhSachNguoiDung', {
      params: { MaNhom: maNhom },
    });
    return response.data;
  },

  searchUsers: async (tuKhoa: string, maNhom: string = DEFAULT_GROUP): Promise<AdminUser[]> => {
    const response = await apiInstance.get<AdminUser[]>('/QuanLyNguoiDung/TimKiemNguoiDung', {
      params: {
        MaNhom: maNhom,
        tuKhoa,
      },
    });
    return response.data;
  },

  addUser: async (payload: AdminUserPayload): Promise<AdminUser> => {
    const response = await apiInstance.post<AdminUser>('/QuanLyNguoiDung/ThemNguoiDung', payload);
    return response.data;
  },

  updateUser: async (payload: AdminUserPayload): Promise<AdminUser> => {
    const response = await apiInstance.put<AdminUser>('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', payload);
    return response.data;
  },

  deleteUser: async (taiKhoan: string): Promise<string> => {
    const response = await apiInstance.delete<string>('/QuanLyNguoiDung/XoaNguoiDung', {
      params: { TaiKhoan: taiKhoan },
    });
    return response.data;
  },

  getCourses: async (maNhom: string = DEFAULT_GROUP): Promise<AdminCourseSearchResult[]> => {
    const response = await apiInstance.get<AdminCourseSearchResult[]>('/QuanLyKhoaHoc/LayDanhSachKhoaHoc', {
      params: { MaNhom: maNhom },
    });
    return response.data;
  },

  searchCourses: async (tenKhoaHoc: string, maNhom: string = DEFAULT_GROUP): Promise<AdminCourseSearchResult[]> => {
    const response = await apiInstance.get<AdminCourseSearchResult[]>('/QuanLyKhoaHoc/LayDanhSachKhoaHoc', {
      params: {
        tenKhoaHoc,
        MaNhom: maNhom,
      },
    });
    return response.data;
  },

  getCourseCategories: async (): Promise<CourseCategory[]> => {
    const response = await apiInstance.get<CourseCategory[]>('/QuanLyKhoaHoc/LayDanhMucKhoaHoc');
    return response.data;
  },

  addCourse: async (payload: AdminCoursePayload): Promise<string> => {
    const response = await apiInstance.post<string>('/QuanLyKhoaHoc/ThemKhoaHoc', payload);
    return response.data;
  },

  updateCourse: async (payload: AdminCoursePayload): Promise<string> => {
    const response = await apiInstance.put<string>('/QuanLyKhoaHoc/CapNhatKhoaHoc', payload);
    return response.data;
  },

  deleteCourse: async (maKhoaHoc: string): Promise<string> => {
    const response = await apiInstance.delete<string>('/QuanLyKhoaHoc/XoaKhoaHoc', {
      params: { maKhoaHoc },
    });
    return response.data;
  },

  getUnenrolledUsersByCourse: async (maKhoaHoc: string): Promise<EnrollmentStudent[]> => {
    const response = await apiInstance.post<EnrollmentStudent[]>('/QuanLyNguoiDung/LayDanhSachNguoiDungChuaGhiDanh', {
      maKhoaHoc,
    });
    return response.data;
  },

  getPendingUsersByCourse: async (maKhoaHoc: string): Promise<EnrollmentStudent[]> => {
    const response = await apiInstance.post<EnrollmentStudent[]>('/QuanLyNguoiDung/LayDanhSachHocVienChoXetDuyet', {
      maKhoaHoc,
    });
    return response.data;
  },

  getEnrolledUsersByCourse: async (maKhoaHoc: string): Promise<EnrollmentStudent[]> => {
    const response = await apiInstance.post<EnrollmentStudent[]>('/QuanLyNguoiDung/LayDanhSachHocVienKhoaHoc', {
      maKhoaHoc,
    });
    return response.data;
  },

  approveEnrollment: async (payload: EnrollmentPayload): Promise<string> => {
    const response = await apiInstance.post<string>('/QuanLyKhoaHoc/GhiDanhKhoaHoc', payload);
    return response.data;
  },

  cancelEnrollment: async (payload: EnrollmentPayload): Promise<string> => {
    const response = await apiInstance.post<string>('/QuanLyKhoaHoc/HuyGhiDanh', payload);
    return response.data;
  },

  getCourseDetail: async (maKhoaHoc: string): Promise<Course> => {
    const response = await apiInstance.get<Course>('/QuanLyKhoaHoc/LayThongTinKhoaHoc', {
      params: { maKhoaHoc },
    });
    return response.data;
  },
};

export default adminService;
