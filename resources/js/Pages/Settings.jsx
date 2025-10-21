import { useTranslation } from "react-i18next";
import AppLayout from "../Layouts/AppLayout";
import TextInput from "../src/components/ui/TextInput";
import { router, useForm, usePage } from "@inertiajs/react";
import SingleFileUpload from "../src/components/ui/SingleFileUpload";
import Button from "../src/components/ui/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { route } from "ziggy-js";
import ErrorMessage from "../src/components/ui/ErrorMessage";

export default function Settings() {
    const { t } = useTranslation();
    const { settings } = usePage().props;
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm({
        company_name: settings?.company_name ?? '',
        email: settings?.email ?? '',
        phone: settings?.phone ?? '',
        address: settings?.address ?? '',
        logo: settings?.logo ?? '',
        logo_url: settings?.logo ? `/storage/${settings.logo}` : null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('settings.store'), {
            onSuccess: (page) => {
                const error = page.props?.flash?.error;
                const success = page.props?.flash?.success;
                router.reload({ only: ['settings'] });
                if (error) notifyError(error, 'bottom-center');
                notifySuccess(success, 'bottom-center');
            },
        });
    };
    return (
        <AppLayout>
            <div className="card h-100 p-0 radius-12 overflow-hidden">
                <div className="card-body p-40">
                    <form action="#">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="mb-20">
                                    <label
                                        htmlFor="companyName"
                                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                                    >
                                        {t('Company Name')} <span className="text-danger-600">*</span>
                                    </label>
                                    <TextInput
                                        type="text"
                                        className="form-control radius-8"
                                        id="companyName"
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name', e.target.value)}
                                        placeholder={t('Enter Attribute', { attribute: t('Company Name') })}
                                        errorMessage={errors.company_name}
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
                                        placeholder={t('Enter Attribute', { attribute: t('Email') })}
                                        errorMessage={errors.email}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="mb-20">
                                    <label
                                        htmlFor="phone"
                                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                                    >
                                        {t('Phone')} <span className="text-danger-600">*</span>
                                    </label>
                                    <TextInput
                                        id="phone"
                                        type="text"
                                        inputMode="numeric"
                                        className="form-control"
                                        onKeyDown={(e) => {
                                            const invalidChars = ['-', '+', 'e', 'E'];
                                            if (invalidChars.includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
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
                            <div className="col-sm-6">
                                <div className="mb-20">
                                    <label
                                        htmlFor="address"
                                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                                    >
                                        {t('Address')} <span className="text-danger-600">*</span>
                                    </label>
                                    <TextInput
                                        type="text"
                                        className="form-control radius-8"
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder={t('Enter Attribute', { attribute: t('Address') })}
                                        errorMessage={errors.address}
                                    />
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="mb-20">
                                    <label
                                        htmlFor="logo"
                                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                                    >
                                        {t('Logo')} <span className="text-danger-600">*</span>
                                    </label>
                                    <SingleFileUpload
                                        id="logo"
                                        name="logo"
                                        label={t('Upload Image')}
                                        initialFileUrl={data.logo_url}
                                        onFileChange={(file) => {
                                            clearErrors('logo');
                                            setData('logo', file)
                                        }}
                                        onFileRemove={() => setData('logo', null)}
                                        allowedFileTypes={['image/*']}
                                        height={300}
                                    />
                                    {errors.logo && <ErrorMessage message={errors.logo} />}
                                </div>
                            </div>

                            <div className="d-flex flex-wrap align-items-center gap-3">
                                <Button
                                    type="button"
                                    isLoading={processing}
                                    onClick={handleSubmit}
                                    className="btn btn-sm btn-primary radius-8 px-20 py-11 d-flex align-items-center gap-2"
                                >
                                    <Icon icon='mdi:content-save' />
                                    {t('Save Settings')}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
        </AppLayout >
    );
}