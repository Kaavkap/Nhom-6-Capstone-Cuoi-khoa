export interface User {
  taiKhoan: string;
  hoTen: string;
  email: string;
  soDT: string;
  maNhom: string;
  maLoaiNguoiDung: string;
  accessToken?: string;
}

export interface UserLogin {
  taiKhoan: string;
  matKhau: string;
}

export interface UserRegister extends UserLogin {
  hoTen: string;
  email: string;
  soDT: string;
  maNhom: string;
}

export enum UserType {
  GV = 'GV',
  HV = 'HV',
}
