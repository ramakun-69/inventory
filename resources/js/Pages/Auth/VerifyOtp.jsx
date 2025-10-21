import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import AuthLayout from "../../Layouts/AuthLayout";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import dayjs from "dayjs";
import Button from "../../src/components/ui/Button";
import { notifyError } from "../../src/components/ui/Toastify";
import { identity } from "@fullcalendar/core/internal";

export default function VerifyOtp({identity}) {
    const { t } = useTranslation();
    const { settings, flash} = usePage().props;

    // FORM
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        otp: ["", "", "", "", "", ""],
        identity : identity
    });

    // Refs untuk input
    const inputs = useRef([]);

    // Handle perubahan per-digit OTP
    const handleChange = (index, value) => {
        if (/^\d?$/.test(value)) { // hanya angka
            const newOtp = [...data.otp];
            newOtp[index] = value;
            setData("otp", newOtp);

            // auto fokus ke input berikutnya
            if (value && index < 5) {
                inputs.current[index + 1].focus();
            }
        }
    };

    // Handle backspace → fokus ke input sebelumnya
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !data.otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    // Timer
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        // cek apakah ada timestamp tersimpan
        const savedExpire = localStorage.getItem("otp_expire_at");
        const now = dayjs();
        let expireTime;

        if (savedExpire && dayjs(savedExpire).isAfter(now)) {
            // masih valid
            expireTime = dayjs(savedExpire);
        } else {
            // buat baru
            expireTime = now.add(10, "minute");
            localStorage.setItem("otp_expire_at", expireTime.toISOString());
        }

        const timer = setInterval(() => {
            const diff = expireTime.diff(dayjs(), "second");
            setTimeLeft(diff > 0 ? diff : 0);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };
    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").trim();

        // hanya izinkan angka
        if (!/^\d+$/.test(paste)) return;

        const digits = paste.split("").slice(0, 6); // ambil max 6 digit
        const newOtp = [...data.otp];

        digits.forEach((d, i) => {
            newOtp[i] = d;
            if (inputs.current[i]) inputs.current[i].value = d;
        });

        setData("otp", newOtp);

        // fokus ke input terakhir yang terisi
        const nextIndex = digits.length < 6 ? digits.length : 5;
        if (inputs.current[nextIndex]) {
            inputs.current[nextIndex].focus();
        }
    };


    // Submit OTP
    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route("verify-otp.store"), {
            data: { otp: data.otp.join("") },
        });
    };
    useEffect(() => {
        if (flash.error) {
            notifyError(flash.error, 'bottom-center');
        }
    }, [flash.error]);
    return (
        <AuthLayout>
            <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
                <div className="max-w-464-px mx-auto w-100">
                    <div className="text-center mb-6">
                        <Link href="/" className="mb-20 max-w-100-px item d-inline-block">
                            <img
                                src={
                                    settings?.logo
                                        ? `/storage/${settings.logo}`
                                        : "assets/images/favicon.png"
                                }
                                alt=""
                                className="img-fluid mx-auto"
                            />
                        </Link>
                        <h4 className="mb-2 text-center">{t("Verify OTP")}</h4>
                        <p className="text-neutral-600">
                            {t("Enter the 6-digit code sent to your whatsapp.")}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                        <div
                            className="d-flex justify-content-center align-items-center gap-2 mb-4"
                            onPaste={(e) => handlePaste(e)}
                        >
                            {data.otp.map((value, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={value}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    ref={(el) => (inputs.current[index] = el)}
                                    className="text-center form-control rounded fw-bold fs-4 border-secondary"
                                    style={{
                                        width: "65px",
                                        height: "55px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                    }}
                                />
                            ))}
                        </div>


                        {errors.otp && (
                            <p className="text-red-500 text-sm text-center mb-4">
                                {errors.otp}
                            </p>
                        )}

                        <div className="text-center mb-4">
                            {timeLeft > 0 ? (
                                <p className="text-sm text-neutral-600">
                                    {t("OTP will expire in")}{" "}
                                    <span className="font-semibold text-primary-600">
                                        {formatTime(timeLeft)}
                                    </span>
                                </p>
                            ) : (
                                <p className="text-sm text-red-500 font-medium">
                                    {t("OTP has expired")}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={processing || timeLeft <= 0 || data.otp.includes("")}
                            className="btn btn-primary text-sm px-12 py-16 w-100 radius-12 mt-4 d-flex align-items-center justify-content-center"
                        >
                            {t("Verify OTP")}
                        </Button>

                        <div className="mt-4 text-center text-sm">
                            <Link
                                href={timeLeft > 0 ? "#" : route("forgot-password.index")}
                                onClick={(e) => {
                                    if (timeLeft > 0) e.preventDefault(); // cegah klik saat belum boleh
                                }}
                                className={`fw-medium ${timeLeft > 0 ? "text-secondary opacity-50 pe-none" : "text-primary-600"
                                    }`}
                                style={{ pointerEvents: timeLeft > 0 ? "none" : "auto" }}
                            >
                                {timeLeft > 0
                                    ? `${t("Resend OTP in")} ${formatTime(timeLeft)}`
                                    : t("Resend OTP")}
                            </Link>

                        </div>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
}
