import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useForm, usePage } from "@inertiajs/react";
import ThemeToggleButton from "../../src/helper/ThemeToggleButton";
import { useTranslation } from "react-i18next";
import { confirmAlert } from "../../src/components/ui/SweetAlert";
import CheckBoxInput from "../../src/components/ui/CheckBoxInput";
import { useState } from "react";
import axios from "axios";

import i18n from "../../i18n";

export default function Navbar({ sidebarControl, mobileMenuControl, sidebarActive }) {
    const { t } = useTranslation();
    const [currentLang, setCurrentLang] = useState(i18n.language);
    const { post } = useForm();
    const handleLogout = () => {
        confirmAlert(t('Are You Sure?'), t('logout_confirmation'), 'warning', () => {
            post(route('logout'));
        })
    }

    const handleChangeLanguage = (e) => {
        const newLang = e.target.value;
        setCurrentLang(newLang);
        i18n.changeLanguage(newLang);
        
        axios.post('/set-language', { locale: newLang })
            .then(response => {
                console.log('Bahasa berhasil diganti:', response.data.message);
            })
            .catch(err => {
                console.error('Gagal mengganti bahasa:', err);
            });
    }

    const user = usePage().props.auth.user;
    return (
        <>
            <div className='navbar-header'>
                <div className='row align-items-center justify-content-between'>
                    <div className='col-auto'>
                        <div className='d-flex flex-wrap align-items-center gap-4'>
                            <button
                                type='button'
                                className='sidebar-toggle'
                                onClick={sidebarControl}
                            >
                                {sidebarActive ? (
                                    <Icon
                                        icon='iconoir:arrow-right'
                                        className='icon text-2xl non-active'
                                    />
                                ) : (
                                    <Icon
                                        icon='heroicons:bars-3-solid'
                                        className='icon text-2xl non-active '
                                    />
                                )}
                            </button>
                            <button
                                onClick={mobileMenuControl}
                                type='button'
                                className='sidebar-mobile-toggle'
                            >
                                <Icon icon='heroicons:bars-3-solid' className='icon' />
                            </button>
                            {/* <form className='navbar-search'>
                                <input type='text' name='search' placeholder='Search' />
                                <Icon icon='ion:search-outline' className='icon' />
                            </form> */}
                        </div>
                    </div>
                    <div className='col-auto'>
                        <div className='d-flex flex-wrap align-items-center gap-3'>
                            {/* ThemeToggleButton */}
                            <ThemeToggleButton />
                            <div className='dropdown d-none d-sm-inline-block'>
                                <button
                                    className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
                                    type='button'
                                    data-bs-toggle='dropdown'
                                >
                                    <img
                                        src={`/assets/images/flags/${currentLang == 'id-ID' ? 'id' : 'gb'}.png`}
                                        alt='Wowdash'
                                        className='w-100 h-100 object-fit-cover rounded-circle'
                                    />
                                </button>
                                <div className='dropdown-menu to-top dropdown-menu-sm'>
                                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                                        <div>
                                            <h6 className='text-lg text-primary-light fw-semibold mb-0'>
                                                {t('Choose Language')}
                                            </h6>
                                        </div>
                                    </div>
                                    <div className='max-h-400-px overflow-y-auto scroll-sm pe-8'>
                                        <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                                            <label
                                                className='form-check-label line-height-1 fw-medium text-secondary-light'
                                                htmlFor='indonesia'
                                            >
                                                <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                                    <img
                                                        src='/assets/images/flags/id.png'
                                                        alt=''
                                                        className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                                                    />
                                                    <span className='text-md fw-semibold mb-0'>
                                                        {t('Indonesian')}
                                                    </span>
                                                </span>
                                            </label>
                                            <CheckBoxInput
                                                className='form-check-input'
                                                type='radio'
                                                name='language'
                                                id='indonesia'
                                                value='id-ID'
                                                checked={currentLang === 'id-ID'}
                                                onChange={handleChangeLanguage}
                                            />
                                        </div>
                                        <div className='form-check style-check d-flex align-items-center justify-content-between mb-16'>
                                            <label
                                                className='form-check-label line-height-1 fw-medium text-secondary-light'
                                                htmlFor='english'
                                            >
                                                <span className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                                                    <img
                                                        src='/assets/images/flags/gb.png'
                                                        alt=''
                                                        className='w-36-px h-36-px bg-success-subtle text-success-main rounded-circle flex-shrink-0'
                                                    />
                                                    <span className='text-md fw-semibold mb-0'>
                                                        {t('English')}
                                                    </span>
                                                </span>
                                            </label>
                                            <CheckBoxInput
                                                className='form-check-input'
                                                type='radio'
                                                value='en-GB'
                                                checked={currentLang === 'en-GB'}
                                                onChange={handleChangeLanguage}
                                                name='language'
                                                id='english'
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {/* Language dropdown end */}

                            {/* Profile dropdown start */}
                            <div className='dropdown'>
                                <button
                                    className='d-flex justify-content-center align-items-center rounded-circle'
                                    type='button'
                                    data-bs-toggle='dropdown'
                                >
                                    <img
                                        src={user?.photo}
                                        alt='image_user'
                                        className='w-40-px h-40-px object-fit-cover rounded-circle'
                                    />
                                </button>
                                <div className='dropdown-menu to-top dropdown-menu-sm'>
                                    <div className='py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
                                        <div>
                                            <h6 className='text-lg text-primary-light fw-semibold mb-2'>
                                                {user.name}
                                            </h6>
                                            <span className='text-secondary-light fw-medium text-sm'>
                                                {user.email}
                                            </span>
                                        </div>
                                        <button type='button' className='hover-text-danger'>
                                            <Icon
                                                icon='radix-icons:cross-1'
                                                className='icon text-xl'
                                            />
                                        </button>
                                    </div>
                                    <ul className='to-top-list'>
                                        <li>
                                            <Link
                                                className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                                                href={route('profile.index')}
                                            >
                                                <Icon
                                                    icon='solar:user-linear'
                                                    className='icon text-xl'
                                                />{" "}
                                                {t('Profile')}
                                            </Link>
                                        </li>
                                    
                                        <li>
                                            <button
                                                type='button'
                                                className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3'
                                                onClick={handleLogout}
                                            >
                                                <Icon icon='lucide:power' className='icon text-xl' />
                                                {t('Logout')}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* Profile dropdown end */}
                        </div>
                    </div>
                </div>
            </div>
        </>)
}