import apiInstance from './apiInstance';

export const userService = {
  getProfile: async (): Promise<any> => {
    // Endpoints for profile info in Cybersoft is POST /QuanLyNguoiDung/ThongTinTaiKhoan
    const response = await apiInstance.post('/QuanLyNguoiDung/ThongTinTaiKhoan');
    return response.data;
  },

  updateProfile: async (data: any): Promise<any> => {
    // Endpoints for updating profile is PUT /QuanLyNguoiDung/CapNhatThongTinNguoiDung
    const response = await apiInstance.put('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', data);
    return response.data;
  }
};
