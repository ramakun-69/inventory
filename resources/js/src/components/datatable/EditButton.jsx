import { Icon } from "@iconify/react/dist/iconify.js";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export default function EditButton({ type, isLoading, loadingText = false, children, ...props }) {
    const { t } = useTranslation()
    return (
        <>
            <button
                type={type}
                className="btn btn-sm btn-warning me-1"
                disabled={isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Icon icon="line-md:loading-loop" className=" me-2" width="20" height="20" />
                        {loadingText ? t('Loading') : ""}
                    </>
                ) : (
                    <>
                        <Icon icon="mdi:edit" className="me-2 " width="20" height="20" />
                        {children}
                    </>
                )}
            </button>
        </>
    );
}