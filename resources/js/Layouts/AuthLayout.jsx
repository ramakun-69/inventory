import React from "react";
import { ToastContainer } from "react-toastify";

export default function AuthLayout({ children }) {
    return (
        <>
            <ToastContainer position="top-right" autoClose={2000} />
            <section className="auth bg-base d-flex flex-wrap">
                <div className="auth-left d-lg-block d-none">
                    <div className="d-flex align-items-center flex-column h-100 justify-content-center">
                        <img src="assets/images/auth/auth-img.png" alt="" />
                    </div>
                </div>
                {children}
            </section>
        </>
    );
}
