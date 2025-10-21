import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AppLayout from "../../Layouts/AppLayout";
import Button from "../../src/components/ui/Button";
import TextInput from "../../src/components/ui/TextInput";
import { notifyError, notifySuccess } from "../../src/components/ui/Toastify";

export default function Index() {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const [imagePreview, setImagePreview] = useState(auth?.user?.photo);

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
            };
            reader.readAsDataURL(file);
            setData('photo', file);
        }
    };
    const { data, setData, post, put, processing, errors, reset, transform, clearErrors } = useForm({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        username: auth?.user?.username || '',
        phone: auth?.user?.phone || '',
        photo: null,
        password: '',
        password_confirmation: '',
    });

    return (
        <AppLayout>
            <div className="row gy-4">
                <div className="col-lg-4">
                    <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
                        <div className="pb-24 ms-16 mb-24 me-16 mt-20">
                            <div className="text-center border border-top-0 border-start-0 border-end-0">
                                <img
                                    src={auth?.user?.photo}
                                    alt=""
                                    className="border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover"
                                />
                                <h6 className="mb-0 mt-16">{auth?.user?.name}</h6>
                                <span className="text-secondary-light mb-16">{auth?.user?.email}</span>
                            </div>
                            <div className="mt-24">
                                <h6 className="text-xl mb-16">{t('Personal Info')}</h6>
                                <ul>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            {t('Name')}
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {auth?.user?.name}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            {t('Email')}
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {auth?.user?.email}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            {t('Phone')}
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {auth?.user?.phone || '-'}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            {t('Position')}
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {auth?.user?.position || '-'}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            {t('Division')}
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {auth?.user?.division?.name || '-'}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="card h-100">
                        <div className="card-body p-24">
                            <ul
                                className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
                                id="pills-tab"
                                role="tablist"
                            >
                                <li className="nav-item" role="presentation">
                                    <Button
                                        type="button"
                                        className="nav-link d-flex align-items-center px-24 active"
                                        id="pills-edit-profile-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-edit-profile"
                                        role="tab"
                                        aria-controls="pills-edit-profile"
                                        aria-selected="true"
                                    >
                                        {t('Edit Profile')}
                                    </Button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <Button
                                        className="nav-link d-flex align-items-center px-24"
                                        id="pills-change-passwork-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-change-passwork"
                                        type="button"
                                        role="tab"
                                        aria-controls="pills-change-passwork"
                                        aria-selected="false"
                                        tabIndex={-1}
                                    >
                                        {t('Change Password')}
                                    </Button>
                                </li>
                            </ul>
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="pills-edit-profile"
                                    role="tabpanel"
                                    aria-labelledby="pills-edit-profile-tab"
                                    tabIndex={0}
                                >
                                    <h6 className="text-md text-primary-light mb-16">{t('Profile Image')}</h6>
                                    {/* Upload Image Start */}
                                    <div className="mb-24 mt-16">
                                        <div className="avatar-upload">
                                            <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                                <TextInput
                                                    type="file"
                                                    id="imageUpload"
                                                    accept=".png, .jpg, .jpeg"
                                                    hidden
                                                    onChange={(e) => handleImageChange(e)}
                                                />
                                                <label
                                                    htmlFor="imageUpload"
                                                    className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                                                >
                                                    <Icon icon="solar:camera-outline" className="icon"></Icon>
                                                </label>
                                            </div>
                                            <div className="avatar-preview">
                                                <div
                                                    id="imagePreview"
                                                    style={{
                                                        backgroundImage: `url(${imagePreview})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Upload Image End */}
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="name"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    {t('Name')}
                                                    <span className="text-danger-600">*</span>
                                                </label>
                                                <TextInput
                                                    type="text"
                                                    className="form-control radius-8"
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder={t('Enter Name')}
                                                    errorMessage={errors.name}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="email"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    {t('Email')} <span className="text-danger-600">*</span>
                                                </label>
                                                <TextInput
                                                    type="email"
                                                    className="form-control radius-8"
                                                    id="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder={t('Enter Email')}
                                                    errorMessage={errors.email}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="username"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    {t('Username')} <span className="text-danger-600">*</span>
                                                </label>
                                                <TextInput
                                                    type="text"
                                                    className="form-control radius-8"
                                                    disabled={true}
                                                    id="username"
                                                    value={data.username}
                                                    onChange={(e) => setData('username', e.target.value)}
                                                    placeholder={t('Enter Attribute', { attribute: t('Username') })}
                                                    errorMessage={errors.username}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="mb-20">
                                                <label
                                                    htmlFor="number"
                                                    className="form-label fw-semibold text-primary-light text-sm mb-8"
                                                >
                                                    {t('Phone')} <span className="text-danger-600">*</span>
                                                </label>
                                                <TextInput
                                                    id="phone"
                                                    type="text"
                                                    inputMode="numeric"
                                                    className="form-control"
                                                    autoComplete="off"
                                                    onChange={(e) => {
                                                        const onlyNums = e.target.value.replace(/\D/g, '');
                                                        setData('phone', onlyNums);
                                                    }}
                                                    placeholder={t('Enter Attribute', { 'attribute': t('Phone') })}
                                                    value={data.phone}
                                                    errorMessage={errors.phone} />
                                            </div>
                                        </div>


                                    </div>
                                </div>
                                <div className="tab-pane fade" id="pills-change-passwork" role="tabpanel" aria-labelledby="pills-change-passwork-tab" tabIndex="0">
                                    <div className="mb-20">
                                        <label htmlFor="your-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            {t('New Password')} <span className="text-danger-600">*</span>
                                        </label>
                                        <div className='has-validation mb-16'>
                                            <div className='icon-field form-group'>
                                                <span className='icon mt-2'>
                                                    <Icon icon='solar:lock-password-outline' />
                                                </span>
                                                <TextInput
                                                    type={passwordVisible ? 'text' : 'password'}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className='bg-neutral-50 radius-12'
                                                    id='password'
                                                    placeholder={t('Password')}
                                                    autoComplete="off"
                                                    errorMessage={errors.password}
                                                />
                                                <span
                                                    className={`toggle-password cursor-pointer position-absolute end-0 translate-middle-y ${errors.password ? 'me-32' : 'me-16'} text-secondary-light`}
                                                    style={{ top: errors.password ? '28%' : '45%' }}
                                                    data-toggle='password' onClick={togglePasswordVisibility}
                                                >
                                                    <Icon icon={passwordVisible ? 'ri:eye-off-line' : 'ri:eye-line'} width="20" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-20">
                                        <label htmlFor="confirm-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            {t('Confirm Password')} <span className="text-danger-600">*</span>
                                        </label>

                                        <div className='has-validation mb-16'>
                                            <div className='icon-field form-group'>
                                                <span className='icon mt-2'>
                                                    <Icon icon='solar:lock-password-outline' />
                                                </span>
                                                <TextInput
                                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    className='bg-neutral-50 radius-12'
                                                    id='password'
                                                    placeholder={t('Confirm Password')}
                                                    autoComplete="off"
                                                    errorMessage={errors.password_confirmation}
                                                />
                                                <span
                                                    className={`cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light ${errors.password_confirmation ? 'me-32' : 'me-16'} text-secondary-light`}
                                                    style={{ top: errors.password_confirmation ? '28%' : '45%' }}
                                                    data-toggle='password' onClick={toggleConfirmPasswordVisibility}
                                                >
                                                    <Icon icon={confirmPasswordVisible ? 'ri:eye-off-line' : 'ri:eye-line'} width="20" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-start justify-content-start gap-3">
                                <Button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        transform((data) => ({
                                            ...data,
                                            _method: 'PUT',
                                        }));
                                        post(route('profile.update', auth?.user?.id), {
                                            onSuccess: (page) => {
                                                const error = page.props?.flash?.error;
                                                const success = page.props?.flash?.success;
                                                if (error) notifyError(error, 'bottom-center');
                                                notifySuccess(success, 'bottom-center');
                                                reset('password', 'password_confirmation', 'photo');

                                            },
                                        });
                                    }}
                                    isLoading={processing}
                                    className="btn btn-primary btn-sm border border-primary-600 "
                                >
                                    {t('Save')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout >
    );
}