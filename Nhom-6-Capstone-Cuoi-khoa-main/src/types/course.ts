export interface Course {
  maKhoaHoc: string;
  biDanh: string;
  tenKhoaHoc: string;
  moTa: string;
  luotXem: number;
  hinhAnh: string;
  maNhom: string;
  ngayTao: string;
  soLuongHocVien: number;
  nguoiTao: Creator;
  danhMucKhoaHoc: CourseCategoryShort;
}

export interface Creator {
  taiKhoan: string;
  hoTen: string;
  maLoaiNguoiDung: string;
  tenLoaiNguoiDung: string;
}

export interface CourseCategoryShort {
  maDanhMucKhoaHoc: string;
  tenDanhMucKhoaHoc: string;
}

export interface CourseCategory {
  maDanhMuc: string;
  tenDanhMuc: string;
}
