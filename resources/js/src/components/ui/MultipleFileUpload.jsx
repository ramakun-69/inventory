import React, { useEffect, useRef } from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';

import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';

export default function MultipleFileUpload({
    initialFileUrls = [],
    data,
    setData,
    fieldName,
    maxFiles = 5,
    allowedFileTypes = null,
    height = 300,
}) {
    const uppyRef = useRef(null);

    // buat instance Uppy hanya sekali
    if (!uppyRef.current) {
        uppyRef.current = new Uppy({
            restrictions: { maxNumberOfFiles: maxFiles, allowedFileTypes },
            autoProceed: false,
        });
    }
    const uppy = uppyRef.current;

    // handle add & remove file
    useEffect(() => {
        const handleAdd = (file) => {
            setData(prevData => ({
                ...prevData,
                [fieldName]: [...(prevData[fieldName] || []), file.data],
            }));
        };

        const handleRemove = (file) => {
            setData(prevData => ({
                ...prevData,
                [fieldName]: (prevData[fieldName] || []).filter(f => f.name !== file.data.name),
            }));
        };

        uppy.on('file-added', handleAdd);
        uppy.on('file-removed', handleRemove);

        return () => {
            uppy.off('file-added', handleAdd);
            uppy.off('file-removed', handleRemove);
        };
    }, [uppy, fieldName, setData]);

    // preload file lama dari URL
    useEffect(() => {
        if (Array.isArray(initialFileUrls) && initialFileUrls.length > 0) {
            Promise.all(
                initialFileUrls.map((url) =>
                    fetch(url)
                        .then(res => res.blob())
                        .then(blob => new File([blob], url.split('/').pop(), { type: blob.type }))
                )
            ).then((files) => {
                // hapus file lama di Uppy
                uppy.cancelAll();
                // tambahkan file preload ke Uppy & state dengan callback setData
                files.forEach(file => uppy.addFile({ name: file.name, type: file.type, data: file }));
                setData(prevData => ({
                    ...prevData,
                    [fieldName]: files, // <- ganti, jangan ditambah
                }));
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialFileUrls]);

    return (
        <Dashboard
            uppy={uppy}
            height={height}
            showProgressDetails
            hideUploadButton={true}
            proudlyDisplayPoweredByUppy={false}
        />
    );
}
