import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notifySuccess = (message, position = "bottom-right") => {
    toast.success(message, {
        position: position,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: "✅",
        style: {
            backgroundColor: "#f0fdf4",
            color: "#14532d",
            border: "1px solid #d1fae5",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "16px",
            width: "700px",
            minWidth: "400px",     // Tambahkan ini
            maxWidth: "100%",

        },
    });
};
const notifyError = (message, position = "bottom-right") => {
    toast.error(message, {
        position: position,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: "❌",
        style: {
            backgroundColor: "#fdf2f2",
            color: "#842029",
            border: "1px solid #f8d7da",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "16px",
            width: "400px",
            minWidth: "400px",     // Tambahkan ini
            maxWidth: "100%",
        },
    });
};
const notifyInfo = (message, position = "bottom-right") => {
    toast.info(message, {
        position: position,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: "ℹ️",
        style: {
            backgroundColor: "#e0f7fa",
            color: "#006064",
            border: "1px solid #b2ebf2",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "16px",
            width: "400px",
            minWidth: "400px",     // Tambahkan ini
            maxWidth: "100%",
        },
    });
};
export { notifySuccess, notifyError, notifyInfo };
