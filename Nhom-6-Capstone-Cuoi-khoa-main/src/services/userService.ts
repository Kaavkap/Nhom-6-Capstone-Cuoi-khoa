import apiInstance from './apiInstance';
import { UpdateProfilePayload, UserProfile } from '@/types/user';

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    // Endpoints for profile info in Cybersoft is POST /QuanLyNguoiDung/ThongTinTaiKhoan
    const response = await apiInstance.post<UserProfile>('/QuanLyNguoiDung/ThongTinTaiKhoan');
    return response.data;
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<UserProfile> => {
    // Endpoints for updating profile is PUT /QuanLyNguoiDung/CapNhatThongTinNguoiDung
    const response = await apiInstance.put<UserProfile>('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', data);
    return response.data;
  }
};
