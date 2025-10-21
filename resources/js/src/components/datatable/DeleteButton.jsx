import React from "react";
import { Icon } from "@iconify/react"; // atau spinner favoritmu

export default function DeleteButton({ type,isLoading, children, ...props }) {
    return (
       
        <button
            type={type}
            className="btn btn-sm btn-danger"
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
                    <Icon icon="mdi:trash" className="me-2 " width="20" height="20" />
                    {children}
                </>
            )}
        </button>
    );
}
