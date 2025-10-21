import { Link, useForm, usePage } from "@inertiajs/react";
import AuthLayout from "../../Layouts/AuthLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import Button from "../../src/components/ui/Button";
import { useEffect, useState } from "react";
import { route } from "ziggy-js";
import TextInput from "../../src/components/ui/TextInput";
import CheckBoxInput from "../../src/components/ui/CheckBoxInput";
import { useTranslation } from "react-i18next";
import { notifyError, notifySuccess } from "../../src/components/ui/Toastify";
export default function Login({ ...props }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        identity: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const { settings, flash } = usePage().props;

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearErrors();
        post(route('authenticate'));
    };
    useEffect(() => {
        if (flash.error) {
            notifyError(flash.error, 'bottom-center');
        } else if (flash.success) {
            notifySuccess(flash.success, 'bottom-center')
        }
    }, [flash.error, flash.success]);
    return <>
        <AuthLayout>
            <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
                <div className='max-w-464-px mx-auto w-100'>
                    <div className="text-center">
                        <Link href='/' className='mb-20 max-w-100-px item d-inline-block'>
                            <img src={settings?.logo ? `/storage/${settings.logo}` : 'assets/images/favicon.png'} alt='' className="img-fluid"></img>
                        </Link>
                        <h4 className='mb-12 text-center'>{t('Login')}</h4>
                        <p className='mb-32 text-secondary-light text-lg text-center'>
                            {t('Please Login To Your Account')}
                        </p>
                    </div>
                    <form action='#' onSubmit={handleSubmit} className="needs-validation" noValidate>
                        <div className='icon-field has-validation mb-16'>
                            <span className='icon mt-2'>
                                <Icon icon='mage:email' />
                            </span>
                            <TextInput
                                type="text"
                                onChange={(e) => setData('identity', e.target.value)}
                                className="bg-neutral-50 radius-12"
                                placeholder={t('Email Or Username')}
                                autoComplete="off"
                                errorMessage={errors.identity}
                            />
                        </div>
                        <div className='icon-field has-validation mb-16'>
                            <div className='icon-field form-group'>
                                <span className='icon mt-2'>
                                    <Icon icon='solar:lock-password-outline' />
                                </span>

                                <TextInput
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className='bg-neutral-50 radius-12'
                                    id='password'
                                    placeholder={t('Password')}
                                    autoComplete="off"
                                    errorMessage={errors.password}
                                />
                            </div>
                            <span
                                className={`toggle-password cursor-pointer position-absolute end-0 translate-middle-y ${errors.password ? 'me-32' : 'me-16'} text-secondary-light`}
                                style={{ top: errors.password ? '28%' : '45%' }}
                                data-toggle='password' onClick={togglePassword}
                            >
                                <Icon icon={showPassword ? 'ri:eye-off-line' : 'ri:eye-line'} width="20" />
                            </span>
                        </div>


                        <div className=''>
                            <div className='d-flex justify-content-between gap-2'>
                                <div className='form-check style-check d-flex align-items-center'>
                                    <CheckBoxInput
                                        className='checked-danger border border-neutral-300'
                                        type='checkbox'
                                        name='remember'
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        id='remember'
                                        label={t('Remember')}
                                        errorMessage={errors.remember}
                                    />

                                </div>
                                <Link href={route('forgot-password.index')} className='text-primary-600 fw-medium'>
                                    {t('Forgot Password')}?
                                </Link>
                            </div>
                        </div>
                        <Button type="submit" className="btn btn-primary text-sm px-12 py-16 w-100 radius-12 mt-32 d-flex align-items-center justify-content-center" isLoading={processing}>
                            {t('Sign In')}
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
}