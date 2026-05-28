import apiInstance from './apiInstance';
import { Course } from '@/types/course';

const courseService = {
  getCourseList: (() => {
    let cache: { data: Course[]; timestamp: number } | null = null;
    const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
    return async (params?: { tenKhoaHoc?: string; maNhom?: string }): Promise<Course[]> => {
      const now = Date.now();
      if (cache && now - cache.timestamp < CACHE_TTL) {
        return cache.data;
      }
      const response = await apiInstance.get<Course[]>('/QuanLyKhoaHoc/LayDanhSachKhoaHoc', {
        params: {
          ...params,
          maNhom: params?.maNhom || 'GP01',
        },
      });
      cache = { data: response.data, timestamp: now };
      return response.data;
    };
  })(),

  getCourseDetail: async (maKhoaHoc: string): Promise<Course> => {
    const response = await apiInstance.get<Course>('/QuanLyKhoaHoc/LayThongTinKhoaHoc', {
      params: { maKhoaHoc },
    });
    return response.data;
  },

  getCourseDetails: async (courseId: string): Promise<any> => {
    const response = await apiInstance.get(`/QuanLyKhoaHoc/LayThongTinKhoaHoc?maKhoaHoc=${courseId}`);
    return response.data;
  },

  enrollCourse: async (maKhoaHoc: string, taiKhoan: string): Promise<any> => {
    const response = await apiInstance.post('/QuanLyKhoaHoc/DangKyKhoaHoc', {
      maKhoaHoc,
      taiKhoan,
    });
    return response.data;
  },

  cancelEnrollment: async (maKhoaHoc: string, taiKhoan: string): Promise<any> => {
    const response = await apiInstance.post('/QuanLyKhoaHoc/HuyGhiDanh', {
      maKhoaHoc,
      taiKhoan,
    });
    return response.data;
  },

  getCategories: async (): Promise<any> => {
    const response = await apiInstance.get('/QuanLyKhoaHoc/LayDanhMucKhoaHoc');
    return response.data;
  },

  getCoursesByCategory: async (categoryId: string): Promise<any> => {
    const response = await apiInstance.get(`/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${categoryId}&MaNhom=GP01`);
    return response.data;
  },
};

export default courseService;
