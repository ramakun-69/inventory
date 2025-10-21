import { useTranslation } from "react-i18next";
import TextInput from "../../src/components/ui/TextInput";
import Button from "../../src/components/ui/Button";
import { Link, useForm, usePage } from "@inertiajs/react";
import AuthLayout from "../../Layouts/AuthLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { notifyError } from "../../src/components/ui/Toastify";
import { identity } from "@fullcalendar/core/internal";

export default function ForgotPassword({ identity }) {
    const { t } = useTranslation();
    const { settings, flash } = usePage().props;
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        password: '',
        password_confirmation: '',
        identity: identity,
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearErrors();
        post(route('reset-password.store'));
    };

    return (
        <>
            <AuthLayout>
                <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
                    <div className='max-w-464-px mx-auto w-100'>
                        <div className="text-center">
                            <Link href='/' className='mb-20 max-w-100-px item d-inline-block'>
                                <img src={settings?.logo ? `/storage/${settings.logo}` : 'assets/images/favicon.png'} alt='' className="img-fluid"></img>
                            </Link>
                            <h4 className='mb-12 text-center'>{t('Forgot Password')}</h4>

                        </div>
                        <form action='#' onSubmit={handleSubmit} className="needs-validation" noValidate>
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
                                            id='password_confirmation'
                                            placeholder={t('Confirm Password')}
                                            autoComplete="off"
                                            errorMessage={errors.password_confirmation}
                                        />
                                        <span
                                            className={`toggle-password cursor-pointer position-absolute end-0 translate-middle-y ${errors.password ? 'me-32' : 'me-16'} text-secondary-light`}
                                            style={{ top: errors.password ? '28%' : '45%' }}
                                            data-toggle='password' onClick={toggleConfirmPasswordVisibility}
                                        >
                                            <Icon icon={confirmPasswordVisible ? 'ri:eye-off-line' : 'ri:eye-line'} width="20" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className=''>
                                <div className='d-flex justify-content-between gap-2'>
                                    <Link href={route('login')} className='text-primary-600 fw-medium'>
                                        {t('Back To Login')}
                                    </Link>
                                </div>
                            </div>
                            <Button type="submit" className="btn btn-primary text-sm px-12 py-16 w-100 radius-12 mt-32 d-flex align-items-center justify-content-center">
                                {t('Submit')}
                            </Button>

                            {/* <div className='mt-32 text-center text-sm'>
                                    <p className='mb-0'>
                                        Don't have an account?{" "}
                                        <Link to='/sign-up' className='text-primary-600 fw-semibold'>
                                            Sign Up
                                        </Link>
                                    </p>
                                </div> */}
                        </form>
                    </div>
                </div>
            </AuthLayout>
        </>
    )

}