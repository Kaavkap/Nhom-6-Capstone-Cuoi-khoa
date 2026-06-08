'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { userService } from '@/services/userService';
import useAuthStore from '@/store/useAuthStore';
import { UpdateProfilePayload, UserProfile } from '@/types/user';

export default function ProfilePage() {
    const router = useRouter();
    const { t } = useTranslation();
    const { currentUser, accessToken } = useAuthStore();
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'courses'>('info');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState<UpdateProfilePayload>({
        taiKhoan: '',
        matKhau: '',
        hoTen: '',
        soDT: '',
        maLoaiNguoiDung: 'HV',
        maNhom: 'GP01',
        email: ''
    });

    const fetchUserProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await userService.getProfile();
            setProfileData(data);
            setFormData({
                taiKhoan: data.taiKhoan || '',
                matKhau: data.matKhau || '',
                hoTen: data.hoTen || '',
                soDT: data.soDT || '',
                maLoaiNguoiDung: data.maLoaiNguoiDung || 'HV',
                maNhom: data.maNhom || 'GP01',
                email: data.email || ''
            });
        } catch (err) {
            console.error("Error loading profile:", err);
            router.replace('/login');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (!currentUser || !accessToken) {
            router.replace('/login');
            return;
        }
        const timer = setTimeout(() => {
            void fetchUserProfile();
        }, 0);

        return () => clearTimeout(timer);
    }, [currentUser, accessToken, router, fetchUserProfile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage(null);
        try {
            await userService.updateProfile(formData);
            setMessage({ type: 'success', text: t('profile.updateSuccess', 'CẬP NHẬT THÔNG TIN TÀI KHOẢN THÀNH CÔNG!') });
            await fetchUserProfile();
        } catch (err: unknown) {
            const errorText = (err as { response?: { data?: string } })?.response?.data || 'CẬP NHẬT THẤT BẠI.';
            setMessage({ type: 'error', text: errorText });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelEnrollment = async (courseId: string) => {
        if (!profileData) return;
        setIsLoading(true);
        try {
            const { default: courseService } = await import('@/services/courseService');
            await courseService.cancelEnrollment(courseId, profileData.taiKhoan);
            setMessage({ type: 'success', text: 'Hủy đăng ký khóa học thành công!' });
            await fetchUserProfile(); // Refresh list after cancel
        } catch (err: unknown) {
            console.error('Error cancelling enrollment:', err);
            const errorText = (err as { response?: { data?: string } })?.response?.data || 'Hủy đăng ký thất bại.';
            setMessage({ type: 'error', text: errorText });
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-32 text-center text-xs font-black tracking-widest text-black animate-pulse">
                LOADING ACCOUNT PROFILE...
            </div>
        );
    }

    return (
        <div className="container mx-auto py-16 px-8 max-w-7xl pt-28 min-h-screen">
            {/* HEADER HERO BANNER */}
            <div className="bg-black text-white p-8 mb-12 border-4 border-black shadow-[8px_8px_0px_0px_#06BBCC]">
                <h1 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter mb-2">
                    {t('profile.title', 'HỒ SƠ CÁ NHÂN')}
                </h1>
                <p className="text-xs tracking-widest uppercase text-gray-400">
                    {t('profile.accountLabel', 'TÀI KHOẢN')}: <span className="text-[#06BBCC] font-black">{profileData?.taiKhoan}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">

                {/* SIDEBAR NAVIGATION CONTROLS */}
                <div className="lg:col-span-1 flex flex-col gap-4 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#06BBCC]">
                    <h3 className="text-xs font-black uppercase tracking-widest text-black mb-2 pb-3 border-b-4 border-black">
                        {t('profile.options', 'Tùy chọn tài khoản')}
                    </h3>

                    <button
                        onClick={() => setActiveTab('info')}
                        className={`w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest border-2 border-black transition-all block ${activeTab === 'info'
                                ? '!bg-black !text-white translate-x-1 translate-y-1 shadow-none'
                                : 'bg-white text-black hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            }`}
                    >
                        👤 {t('profile.personalInfo', 'Thông tin cá nhân')}
                    </button>

                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest border-2 border-black transition-all block ${activeTab === 'courses'
                                ? '!bg-black !text-white translate-x-1 translate-y-1 shadow-none'
                                : 'bg-white text-black hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            }`}
                    >
                        🎓 {t('profile.myCourses', 'Khóa học của tôi')} ({profileData?.chiTietKhoaHocGhiDanh?.length || 0})
                    </button>
                </div>

                {/* DETAILS WORKSPACE PANEL */}
                <div className="lg:col-span-3 bg-white border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_#06BBCC]">
                    {message && (
                        <div className={`p-4 mb-8 border-4 border-black font-black text-xs uppercase tracking-wider ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {activeTab === 'info' ? (
                        <form onSubmit={handleSubmitUpdate} className="space-y-8">
                            <h3 className="text-sm font-black uppercase tracking-widest text-black pb-3 border-b-4 border-black">
                                {t('profile.editHeading', 'CHỈNH SỬA THÔNG TIN TÀI KHOẢN')}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-xs font-black uppercase tracking-wider text-black">{t('profile.username', 'Tài khoản (Cố định)')}</label>
                                    <input
                                        type="text"
                                        name="taiKhoan"
                                        value={formData.taiKhoan}
                                        disabled
                                        className="w-full p-4 border-4 border-black font-black text-xs bg-gray-100 outline-none cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black uppercase tracking-wider text-black">{t('profile.password', 'Mật khẩu mới')}</label>
                                    <input
                                        type="password"
                                        name="matKhau"
                                        value={formData.matKhau}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-4 border-4 border-black font-black text-xs outline-none focus:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black uppercase tracking-wider text-black">{t('profile.fullName', 'Họ và tên')}</label>
                                    <input
                                        type="text"
                                        name="hoTen"
                                        value={formData.hoTen}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-4 border-4 border-black font-black text-xs outline-none focus:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black uppercase tracking-wider text-black">{t('profile.phone', 'Số điện thoại')}</label>
                                    <input
                                        type="text"
                                        name="soDT"
                                        value={formData.soDT}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-4 border-4 border-black font-black text-xs outline-none focus:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <label className="block text-xs font-black uppercase tracking-wider text-black">{t('profile.email', 'Địa chỉ Email')}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-4 border-4 border-black font-black text-xs outline-none focus:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    />
                                </div>
                            </div>

                            {/* FIXED SUBMIT BUTTON (Text is black now, highly visible) */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-8 py-4 bg-[#06BBCC] text-black hover:bg-black hover:text-white font-black uppercase tracking-widest text-xs border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                    {isUpdating ? 'SAVING DATA...' : t('profile.saveButton', 'CẬP NHẬT THÔNG TIN')}
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* ENROLLED COURSES VIEW */
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-black pb-3 border-b-4 border-black mb-8">
                                {t('profile.enrolledHeading', 'DANH SÁCH KHÓA HỌC ĐÃ GHI DANH')}
                            </h3>

                            {profileData?.chiTietKhoaHocGhiDanh && profileData.chiTietKhoaHocGhiDanh.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {profileData.chiTietKhoaHocGhiDanh.map((course: UserProfile['chiTietKhoaHocGhiDanh'][number]) => (
                                        <div
                                            key={course.maKhoaHoc}
                                            className="border-4 border-black p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white"
                                        >
                                            <div>
                                                <div className="w-full aspect-video relative border-4 border-black mb-4 bg-gray-100 overflow-hidden">
                                                    <Image
                                                        src={course.hinhAnh || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80'}
                                                        alt={course.tenKhoaHoc}
                                                        fill
                                                        unoptimized
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <h4 className="text-xs font-black uppercase tracking-tight text-black line-clamp-1 mb-2">
                                                    {course.tenKhoaHoc}
                                                </h4>
                                                <p className="text-[11px] text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                                                    {course.moTa || 'No detail description added yet.'}
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t-4 border-dashed border-black flex justify-between items-center gap-2">
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] bg-black text-white font-black px-2 py-1 uppercase tracking-wider">
                                                        {t('profile.statusEnrolled', 'ĐÃ GHI DANH')}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handleCancelEnrollment(course.maKhoaHoc)}
                                                    className="text-[10px] border-2 border-black bg-white text-red-600 hover:bg-red-50 hover:border-red-600 font-black px-3 py-1 uppercase tracking-wider transition-all"
                                                >
                                                    ❌ HỦY
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 font-black text-xs uppercase tracking-widest text-gray-400 border-4 border-dashed border-black bg-gray-50">
                                    {t('profile.noCourses', 'Bạn chưa tham gia khóa học nào.')}
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
