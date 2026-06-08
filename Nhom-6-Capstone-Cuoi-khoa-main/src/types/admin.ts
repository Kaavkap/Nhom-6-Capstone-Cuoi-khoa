import { Course } from '@/types/course';
import { User } from '@/types/user';

export interface AdminUser extends User {
  matKhau: string;
  soDt?: string;
  biDanh?: string;
  tenLoaiNguoiDung?: string;
}

export interface AdminUserPayload {
  taiKhoan: string;
  matKhau: string;
  hoTen: string;
  soDT: string;
  maLoaiNguoiDung: 'GV' | 'HV';
  maNhom: string;
  email: string;
}

export interface AdminCoursePayload {
  maKhoaHoc: string;
  biDanh: string;
  tenKhoaHoc: string;
  moTa: string;
  luotXem: number;
  danhGia: number;
  hinhAnh: string;
  maNhom: string;
  ngayTao: string;
  maDanhMucKhoaHoc: string;
  taiKhoanNguoiTao: string;
}

export interface EnrollmentPayload {
  maKhoaHoc: string;
  taiKhoan: string;
}

export interface EnrollmentStudent {
  taiKhoan: string;
  hoTen?: string;
  biDanh?: string;
  email?: string;
  soDt?: string;
  maLoaiNguoiDung?: string;
  tenLoaiNguoiDung?: string;
}

export interface AdminCourseSearchResult extends Course {
  maDanhMucKhoaHoc?: string;
}
