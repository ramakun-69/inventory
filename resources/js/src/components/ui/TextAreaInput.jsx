import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ErrorMessage from './ErrorMessage';

export default forwardRef(function TextAreaInput(
    { className = '', isFocused = false, errorMessage,height = "300px", ...props },
    ref,
) {
    const localRef = useRef(null);
    const [localError, setLocalError] = useState(errorMessage);
    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);
    useEffect(() => {
        setLocalError(errorMessage);
    }, [errorMessage]);

    const handleChange = (e) => {
        setLocalError('');
        props.onChange?.(e);
    };
    return (
        <>
            <textarea
                {...props}
                className={`${className} ${localError ? 'is-invalid' : ''}`}
                ref={localRef}
                style={{ height }}
                onChange={handleChange}
            >
            </textarea>
            <ErrorMessage message={localError} className="mt-2 text-danger" />
        </>
    );
});
