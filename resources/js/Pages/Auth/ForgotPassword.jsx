import { useTranslation } from "react-i18next";
import TextInput from "../../src/components/ui/TextInput";
import Button from "../../src/components/ui/Button";
import { Link, useForm, usePage } from "@inertiajs/react";
import AuthLayout from "../../Layouts/AuthLayout";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect } from "react";
import { notifyError } from "../../src/components/ui/Toastify";

export default function ForgotPassword() {
    const { t } = useTranslation();
    const { settings, flash } = usePage().props;
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        identity: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearErrors();
        post(route('forgot-password.store'));
    };

    useEffect(() => {
        if (flash.error) {
            notifyError(flash.error, 'bottom-center');
        }
    }, [flash.error]);
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