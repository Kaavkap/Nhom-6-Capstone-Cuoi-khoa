import apiInstance from './apiInstance';
import { User, UserLogin, UserRegister } from '@/types/user';

const authService = {
  login: async (loginData: UserLogin): Promise<User> => {
    const response = await apiInstance.post<User>('/QuanLyNguoiDung/DangNhap', loginData);
    return response.data;
  },

  register: async (registerData: UserRegister): Promise<UserRegister> => {
    console.log("Payload sent:", registerData);
    const response = await apiInstance.post<UserRegister>('/QuanLyNguoiDung/DangKy', registerData);
    return response.data;
  },
};

export default authService;
