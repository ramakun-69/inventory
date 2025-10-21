import React, { useEffect, useRef } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';

export default function SingleFileUpload({
    initialFileUrl = null,
    onFileChange = () => { },
    maxFiles = 1,
    allowedFileTypes = null,
    height = 130,
}) {
    const uppyRef = useRef(null);
    const preloadedRef = useRef(false);

    if (!uppyRef.current) {
        uppyRef.current = new Uppy({
            restrictions: { maxNumberOfFiles: maxFiles, allowedFileTypes },
            autoProceed: false,
        });
    }
    const uppy = uppyRef.current;

    // listener add/remove
    useEffect(() => {
        const handleAdd = (file) => onFileChange(file.data);
        const handleRemove = () => onFileChange(null);

        uppy.on('file-added', handleAdd);
        uppy.on('file-removed', handleRemove);

        return () => {
            uppy.off('file-added', handleAdd);
            uppy.off('file-removed', handleRemove);
        };
    }, [uppy, onFileChange]);

    // Preload hanya sekali untuk URL pertama
    useEffect(() => {
        if (!preloadedRef.current && typeof initialFileUrl === 'string' && initialFileUrl) {
            fetch(initialFileUrl)
                .then((res) => res.blob())
                .then((blob) => {
                    const fileName = initialFileUrl.split('/').pop();
                    const file = new File([blob], fileName, { type: blob.type });
                    uppy.cancelAll();
                    uppy.addFile({ name: file.name, type: file.type, data: file });
                    preloadedRef.current = true; // tandai sudah preload
                })
                .catch((err) => console.error('Preload gagal:', err));
        }
    }, [initialFileUrl, uppy]);

    return (
        <div className="position-relative">
            <Dashboard
                uppy={uppy}
                height={height}
                showProgressDetails
                proudlyDisplayPoweredByUppy={false}
                hideUploadButton={true}
            />
        </div>
    );
}
