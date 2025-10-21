import React from "react";
import { Icon } from "@iconify/react"; // atau spinner favoritmu

export default function Button({ type, isLoading, children, className = '', loadingType = 1, ...props }) {
    return (
        <button
            type={type}
            className={className}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <Icon icon="line-md:loading-twotone-loop" className="me-2" width="20" height="20" />
                    {loadingType === 1 && "Loading..."}
                </>
            ) : (
                children
            )}
        </button>
    );
}
