import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslation } from "react-i18next";

export default function ShowButton({ type,isLoading, children, ...props }) {
    return (
        <>
            <button
                type={type}
                className="btn btn-sm btn-info me-1"
                disabled={isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Icon icon="line-md:loading-loop" className=" me-2" width="20" height="20" />
                        Loading...
                    </>
                ) : (
                    <>
                        <Icon icon="mdi:eye" className="me-2 " width="20" height="20" />
                        {children}
                    </>
                )}
            </button>
        </>
    );
}