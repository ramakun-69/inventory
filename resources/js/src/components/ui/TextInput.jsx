import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ErrorMessage from './ErrorMessage';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, errorMessage, ...props },
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
            <input
                {...props}
                type={type}
                className={`form-control ${className} ${localError ? 'is-invalid' : ''}`}
                ref={localRef}
                onChange={handleChange}
            />
            <ErrorMessage message={localError} className="mt-2 text-danger" />
        </>
    );
});
