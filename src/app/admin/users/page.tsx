'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import adminService from '@/services/adminService';
import Button from '@/components/common/Button';
import { AdminUser, AdminUserPayload } from '@/types/admin';

const MAX_USERS_VISIBLE = 20;

const defaultForm: AdminUserPayload = {
  taiKhoan: '',
  matKhau: '',
  hoTen: '',
  soDT: '',
  maLoaiNguoiDung: 'HV',
  maNhom: 'GP01',
  email: '',
};

function getUserPhone(user: AdminUser) {
  return user.soDT || user.soDt || '';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [formData, setFormData] = useState<AdminUserPayload>(defaultForm);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const tableUsers = useMemo(() => users, [users]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Không thể tải danh sách người dùng.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  const handleSearch = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const keyword = searchValue.trim();
      if (!keyword) {
        await loadUsers();
        return;
      }
      const data = await adminService.searchUsers(keyword);
      setUsers(data);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Không thể tìm kiếm người dùng.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setIsEdit(false);
  };

  const handleEdit = (user: AdminUser) => {
    setFormData({
      taiKhoan: user.taiKhoan,
      matKhau: user.matKhau || '',
      hoTen: user.hoTen,
      soDT: getUserPhone(user),
      maLoaiNguoiDung: user.maLoaiNguoiDung === 'GV' ? 'GV' : 'HV',
      maNhom: user.maNhom || 'GP01',
      email: user.email,
    });
    setIsEdit(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleDelete = async (taiKhoan: string) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa tài khoản "${taiKhoan}"?`);
    if (!confirmed) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await adminService.deleteUser(taiKhoan);
      setSuccessMessage('Xóa người dùng thành công.');
      await loadUsers();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Xóa người dùng thất bại.';
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
    try {
      if (isEdit) {
        await adminService.updateUser(formData);
        setSuccessMessage('Cập nhật người dùng thành công.');
      } else {
        await adminService.addUser(formData);
        setSuccessMessage('Thêm người dùng thành công.');
      }
      resetForm();
      await loadUsers();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Không thể lưu người dùng.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
      <section className="xl:col-span-1 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[680px] flex flex-col">
        <h2 className="text-sm font-black uppercase tracking-widest border-b-4 border-black pb-3 mb-6">
          {isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <input
            type="text"
            required
            disabled={isEdit}
            value={formData.taiKhoan}
            onChange={(e) => setFormData((prev) => ({ ...prev, taiKhoan: e.target.value }))}
            placeholder="Tài khoản"
            className="w-full h-11 px-4 border-2 border-black text-sm font-bold disabled:bg-gray-100"
          />
          <input
            type="password"
            required
            value={formData.matKhau}
            onChange={(e) => setFormData((prev) => ({ ...prev, matKhau: e.target.value }))}
            placeholder="Mật khẩu"
            className="w-full h-11 px-4 border-2 border-black text-sm font-bold"
          />
          <input
            type="text"
            required
            value={formData.hoTen}
            onChange={(e) => setFormData((prev) => ({ ...prev, hoTen: e.target.value }))}
            placeholder="Họ tên"
            className="w-full h-11 px-4 border-2 border-black text-sm font-bold"
          />
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            className="w-full h-11 px-4 border-2 border-black text-sm font-bold"
          />
          <input
            type="text"
            required
            value={formData.soDT}
            onChange={(e) => setFormData((prev) => ({ ...prev, soDT: e.target.value }))}
            placeholder="Số điện thoại"
            className="w-full h-11 px-4 border-2 border-black text-sm font-bold"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={formData.maLoaiNguoiDung}
              onChange={(e) => setFormData((prev) => ({ ...prev, maLoaiNguoiDung: e.target.value as 'GV' | 'HV' }))}
              className="h-11 px-3 border-2 border-black text-sm font-bold bg-white"
            >
              <option value="HV">HV</option>
              <option value="GV">GV</option>
            </select>
            <input
              type="text"
              required
              value={formData.maNhom}
              onChange={(e) => setFormData((prev) => ({ ...prev, maNhom: e.target.value }))}
              placeholder="Mã nhóm"
              className="h-11 px-3 border-2 border-black text-sm font-bold"
            />
          </div>

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

      <section className="xl:col-span-2 border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[680px] flex flex-col">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-5">
          <h2 className="text-sm font-black uppercase tracking-widest">
            Danh sách người dùng
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm theo tên hoặc tài khoản"
              className="h-11 min-w-[220px] px-4 border-2 border-black text-sm font-bold"
            />
            <Button type="button" onClick={handleSearch}>
              Tìm
            </Button>
            <Button type="button" variant="outline" onClick={loadUsers}>
              Tải lại
            </Button>
          </div>
        </div>

        <p className="mb-4 text-[11px] font-black uppercase tracking-widest text-gray-500">
          Khung hiển thị khoảng {MAX_USERS_VISIBLE} dòng, kéo xuống để xem thêm ({users.length} người dùng)
        </p>

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

        <div className="overflow-hidden border-2 border-black flex-1">
          <div className="overflow-x-auto overflow-y-auto max-h-[520px]">
          <table className="min-w-[980px] text-sm">
            <thead className="bg-black text-white uppercase text-xs tracking-widest sticky top-0 z-10">
              <tr>
                <th className="text-left px-3 py-3 min-w-[170px]">THAO TAC</th>
                <th className="text-left px-3 py-3">Tai khoan</th>
                <th className="text-left px-3 py-3">Họ tên</th>
                <th className="text-left px-3 py-3">Email</th>
                <th className="text-left px-3 py-3">SĐT</th>
                <th className="text-left px-3 py-3">Loại</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center font-black text-xs uppercase tracking-widest">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : tableUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center font-black text-xs uppercase tracking-widest text-gray-500">
                    Không có dữ liệu người dùng
                  </td>
                </tr>
              ) : (
                tableUsers.map((user) => (
                  <tr key={user.taiKhoan} className="border-t border-black/20">
                    <td className="px-3 py-3 min-w-[170px] bg-white">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="px-3 py-2" onClick={() => handleEdit(user)}>
                          Sua
                        </Button>
                        <Button type="button" className="px-3 py-2 bg-red-500 text-white border-red-700 hover:bg-black" onClick={() => handleDelete(user.taiKhoan)}>
                          Xoa
                        </Button>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-black">{user.taiKhoan}</td>
                    <td className="px-3 py-3">{user.hoTen}</td>
                    <td className="px-3 py-3">{user.email}</td>
                    <td className="px-3 py-3">{getUserPhone(user)}</td>
                    <td className="px-3 py-3">{user.maLoaiNguoiDung}</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        </div>
      </section>
    </div>
  );
}




