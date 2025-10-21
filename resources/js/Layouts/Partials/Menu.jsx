import { Link, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react"; // jangan lupa icon
import { route } from "ziggy-js";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRole } from "../../src/hook/useRole";

export default function Menu({ ...props }) {
    const isActive = (namedRoute) => route().current(namedRoute) ? "active-page" : "";
    const isDropDownActive = (namedRoute) => route().current(namedRoute) ? "open" : "";
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const { url } = usePage()
    const { hasAnyRole } = useRole();

    useEffect(() => {
        const openActiveDropdown = () => {
            const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
            allDropdowns.forEach((dropdown) => {
                const submenuLinks = dropdown.querySelectorAll("a[data-route]");
                submenuLinks.forEach((link) => {
                    const namedRoute = link.dataset.route;
                    if (namedRoute && route().current(namedRoute)) {
                        dropdown.classList.add("open");
                        const submenu = dropdown.querySelector(".sidebar-submenu");
                        if (submenu) {
                            submenu.style.maxHeight = `${submenu.scrollHeight}px`;
                        }
                    }
                });
            });
        };

        openActiveDropdown();
    }, [url]);
    return (
        <ul className='sidebar-menu' id='sidebar-menu'>

            <li className="mb-16">
                <Link href={route('dashboard')} className={isActive('dashboard')}>
                    <Icon icon='mdi:home' className='menu-icon' />
                    <span>{t('Dashboard')}</span>
                </Link>
            </li>
            {(hasAnyRole(['Admin'])) && (
                <>
                    <li className='sidebar-menu-group-title'>{t('Master Data')}</li>
                    <li>
                        <Link href={route('master-data.users.index')} className={isActive('master-data.users.*') || isActive('trash.users')}>
                            <Icon icon='mdi:user' className='menu-icon' />
                            <span>{t('Users')}</span>
                        </Link>
                        <Link href={route('master-data.divisions.index')} className={isActive('master-data.divisions.*') || isActive('trash.divisions')}>
                            <Icon icon='mdi:building' className='menu-icon' />
                            <span>{t('Divisions')}</span>
                        </Link>
                        <Link href={route('master-data.suppliers.index')} className={isActive('master-data.suppliers.*') || isActive('trash.suppliers')}>
                            <Icon icon='mdi:truck-delivery' className='menu-icon' />
                            <span>{t('Suppliers')}</span>
                        </Link>
                        <Link href={route('master-data.categories.index')} className={isActive('master-data.categories.*') || isActive('trash.categories')}>
                            <Icon icon='mdi:view-grid' className='menu-icon' />
                            <span>{t('Categories')}</span>
                        </Link>
                        <Link href={route('master-data.units.index')} className={isActive('master-data.units.*') || isActive('trash.units')}>
                            <Icon icon='mdi:package-variant-closed' className='menu-icon' />
                            <span>{t('Units')}</span>
                        </Link>
                        <Link href={route('master-data.items.index')} className={isActive('master-data.items.*') || isActive('trash.items')}>
                            <Icon icon='mdi:package' className='menu-icon' />
                            <span>{t('Items')}</span>
                        </Link>
                    </li>

                </>
            )
            }
            <li className='sidebar-menu-group-title'>{t('Inventory')}</li>
            {(hasAnyRole(['Admin', 'Warehouse'])) && (
                <>
                    <li>
                        <Link href={route('inventory.stock-entries.index')} className={isActive('inventory.stock-entries.*') || isActive('trash.stock-entries')}>
                            <Icon icon='mdi:package-down' className='menu-icon' />
                            <span>{t('Stock Entries')}</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={route('inventory.stock-takings.index')} className={isActive('inventory.stock-takings.*')}>
                            <Icon icon='mdi:package-variant-closed-minus' className='menu-icon' />
                            <span>{t('Stock Takings')}</span>
                        </Link>
                    </li>
                </>
            )}
            <li>
                <Link href={route('inventory.item-requests.index')} className={isActive('inventory.item-requests.*')}>
                    <Icon icon='mdi:package-up' className='menu-icon' />
                    <span>{t('Item Requests')}</span>
                </Link>
            </li>

            {hasAnyRole(['Admin', 'Warehouse']) && (
                <>
                    <li className='sidebar-menu-group-title'>{t('Other')}</li>
                    <li className="dropdown">
                        <Link href="#" className={isActive('report.*')}>
                            <Icon icon='mdi:file-export' className='menu-icon' />
                            <span>{t('Reports')}</span>
                        </Link>
                        <ul className='sidebar-submenu'>
                            <li>
                                <Link href={route('report.items.index')} className={isActive('report.items.*')}>
                                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />
                                    <span>{t('Items')}</span>
                                </Link>
                            </li>
                            
                            <li>
                                <Link href={route('report.stock-entries.index')} className={isActive('report.stock-entries.*')}>
                                    <i className='ri-circle-fill circle-icon text-danger-600 w-auto' />
                                    <span>{t('Stock Entries')}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href={route('report.item-requests.index')} className={isActive('report.item-requests.*')}>
                                    <i className='ri-circle-fill circle-icon text-success-600 w-auto' />
                                    <span>{t('Item Requests')}</span>
                                </Link>
                            </li>


                        </ul>
                    </li>
                    {hasAnyRole(['Admin']) && (
                        <li>
                            <Link href={route('settings.index')} className={isActive('settings.*')}>
                                <Icon icon='mdi:settings' className='menu-icon' />
                                <span>{t('Settings')}</span>
                            </Link>
                        </li>

                    )}
                </>
            )}
            {/* {role.includes('Administrator') || (role.includes('Employee') && (
                <>
                    <li className='sidebar-menu-group-title'>{t('module')}</li>
                    <li>
                        <Link href={route('change-requests.index')} className={isActive('change-requests.*')}>
                            <Icon icon='mdi:exchange' className='menu-icon' />
                            <span>{t('change_requests')}</span>
                        </Link>
                    </li>
                    {permissions.includes('PIC Action Plan') && (
                        <li>
                            <Link href={route('change-requests.index')} className={isActive('change-requests.*')}>
                                <Icon icon='mdi:exchange' className='menu-icon' />
                                <span>{t('action_plans')}</span>
                            </Link>
                        </li>
                    )}
                </>
            ))} */}
        </ul >
    );
}
