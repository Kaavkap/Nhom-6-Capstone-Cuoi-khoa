import apiInstance from './apiInstance';
import { Course, CourseCategory } from '@/types/course';

const courseService = {
  getCourseList: (() => {
    const cache = new Map<string, { data: Course[]; timestamp: number }>();
    const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

    const getCacheKey = (params?: { tenKhoaHoc?: string; maNhom?: string }) => {
      const normalizedParams = {
        tenKhoaHoc: params?.tenKhoaHoc?.trim().toLowerCase() || '',
        maNhom: params?.maNhom || 'GP01',
      };
      return JSON.stringify(normalizedParams);
    };

    return async (params?: { tenKhoaHoc?: string; maNhom?: string }): Promise<Course[]> => {
      const now = Date.now();
      const cacheKey = getCacheKey(params);
      const cached = cache.get(cacheKey);

      if (cached && now - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }

      const response = await apiInstance.get<Course[]>('/QuanLyKhoaHoc/LayDanhSachKhoaHoc', {
        params: {
          ...params,
          maNhom: params?.maNhom || 'GP01',
        },
      });

      cache.set(cacheKey, { data: response.data, timestamp: now });
      return response.data;
    };
  })(),

  getCourseDetail: async (maKhoaHoc: string): Promise<Course> => {
    const response = await apiInstance.get<Course>('/QuanLyKhoaHoc/LayThongTinKhoaHoc', {
      params: { maKhoaHoc },
    });
    return response.data;
  },

  enrollCourse: async (maKhoaHoc: string, taiKhoan: string): Promise<string> => {
    const response = await apiInstance.post<string>('/QuanLyKhoaHoc/DangKyKhoaHoc', {
      maKhoaHoc,
      taiKhoan,
    });
    return response.data;
  },

  cancelEnrollment: async (maKhoaHoc: string, taiKhoan: string): Promise<string> => {
    const response = await apiInstance.post<string>('/QuanLyKhoaHoc/HuyGhiDanh', {
      maKhoaHoc,
      taiKhoan,
    });
    return response.data;
  },

  getCategories: async (): Promise<CourseCategory[]> => {
    const response = await apiInstance.get<CourseCategory[]>('/QuanLyKhoaHoc/LayDanhMucKhoaHoc');
    return response.data;
  },

  getCoursesByCategory: async (categoryId: string): Promise<Course[]> => {
    const response = await apiInstance.get<Course[]>(`/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${categoryId}&MaNhom=GP01`);
    return response.data;
  },
};

export default courseService;
