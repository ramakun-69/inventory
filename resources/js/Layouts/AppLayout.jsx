import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, usePage } from "@inertiajs/react";
import Menu from "./Partials/Menu";
import Navbar from "./Partials/Navbar";
import { ToastContainer } from "react-toastify";

const AppLayout = ({ children }) => {
    let [sidebarActive, seSidebarActive] = useState(false);
    let [mobileMenu, setMobileMenu] = useState(false);
    const url = usePage();
    const {settings} = usePage().props;
    useEffect(() => {
        const handleDropdownClick = (event) => {
            event.preventDefault();
            const clickedLink = event.currentTarget;
            const clickedDropdown = clickedLink.closest(".dropdown");
            console.log(clickedDropdown);
            if (!clickedDropdown) return;

            const isActive = clickedDropdown.classList.contains("open");

            // Close all dropdowns
            const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
            allDropdowns.forEach((dropdown) => {
                dropdown.classList.remove("open");
                const submenu = dropdown.querySelector(".sidebar-submenu");
                if (submenu) {
                    submenu.style.maxHeight = "0px"; // Collapse submenu
                }
            });

            // Toggle the clicked dropdown
            if (!isActive) {
                clickedDropdown.classList.add("open");
                const submenu = clickedDropdown.querySelector(".sidebar-submenu");
                if (submenu) {
                    submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
                }
            }
            // Prevent default link behavior
            const handleMouseUp = (e) => {
                if (e.target.tagName === 'BUTTON') {
                    e.target.blur();
                }
            };
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mouseup', handleMouseUp);
            };
        };

        // Attach click event listeners to all dropdown triggers
        const dropdownTriggers = document.querySelectorAll(
            ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
        );

        dropdownTriggers.forEach((trigger) => {
            trigger.addEventListener("click", handleDropdownClick);
        });



        // Cleanup event listeners on unmount
        return () => {
            dropdownTriggers.forEach((trigger) => {
                trigger.removeEventListener("click", handleDropdownClick);
            });
        };
    }, [url]);

    let sidebarControl = () => {
        seSidebarActive(!sidebarActive);
    };

    let mobileMenuControl = () => {
        setMobileMenu(!mobileMenu);
    };
    return (
        <section className={mobileMenu ? "overlay active" : "overlay "}>
            {/* sidebar */}
            <aside
                className={
                    sidebarActive
                        ? "sidebar active "
                        : mobileMenu
                            ? "sidebar sidebar-open"
                            : "sidebar"
                }
            >
                <button
                    onClick={mobileMenuControl}
                    type='button'
                    className='sidebar-close-btn'
                >
                    <Icon icon='radix-icons:cross-2' />
                </button>
                <div>
                    <Link href='/' className='sidebar-logo'>
                        <img
                            src={settings?.logo ? `/storage/${settings.logo}` : "/assets/images/logo.png"}
                            alt='site logo'
                            className='light-logo'
                        />
                        <img
                            src={settings?.logo ? `/storage/${settings.logo}` : "/assets/images/logo.png"}
                            alt='site logo'
                            className='dark-logo'
                        />
                        <img
                            src={settings?.logo ? `/storage/${settings.logo}` : "/assets/images/logo.png"}
                            alt='site logo'
                            className='logo-icon'
                        />
                    </Link>
                </div>
                <div className='sidebar-menu-area'>
                    <Menu />
                </div>
            </aside>

            <main
                className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
            >
                {/* Navbar Section */}
                <Navbar sidebarControl={sidebarControl} mobileMenuControl={mobileMenuControl} />

                {/* dashboard-main-body */}
                <div className='dashboard-main-body'>{children}</div>
                <ToastContainer />
                {/* Footer section */}
                <footer className='d-footer'>
                    <div className='row align-items-center justify-content-between'>
                        <div className='col-auto'>
                            <p className='mb-0'>© {new Date().getFullYear()} Inventory App. All Rights Reserved.</p>
                        </div>
                        <div className='col-auto'>
                            <p className='mb-0'>
                                Developer by <span className='text-primary-600'>PT. Erasites Citra Digital Indonesia</span>
                            </p>
                        </div>
                    </div>
                </footer>
            </main>
        </section>
    );
};

export default AppLayout;
