import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export default function ErrorPage({ status }) {
    let title;
    let message;
    const { t } = useTranslation();
    switch (status) {
        case 403:
            title = t("Error 403: Forbidden");
            message = t("You do not have permission to access this page.");
            break;
        case 404:
            title = t("Error 404: Page Not Found");
            message = t("We couldn’t find the page you were looking for.");
            break;
        case 500:
            title = t("Error 500: Server Error");
            message = t("Something went wrong on our servers.");
            break;
        case 503:
            title = t("Error 503: Service Unavailable");
            message = t("We’re performing maintenance. Please check back soon.");
            break;
        default:
            title = `${status}`;
            message = "Unexpected error.";
    }

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-white">
            <div className="text-center p-4">
                <h1 className="display-1 fw-bold text-dark">{title}</h1>
                <p className="mt-3 fs-5 text-secondary">{message ?? t("An unexpected error occurred. Please try again later.")}</p>
                <Link href='/' className="btn btn-primary">{t("Back")}</Link>
            </div>
        </div>
    );
}