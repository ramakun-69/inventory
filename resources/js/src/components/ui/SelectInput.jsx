import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ErrorInput from './ErrorInput';

export default forwardRef(function SelectInput(
    { className = '', isFocused = false, errorMessage, ...props },
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
            <select {...props} className={`${className} ${localError ? 'is-invalid' : ''}`} ref={localRef} onChange={handleChange}>
                {props.children}
            </select>
            <ErrorInput message={localError} className="mt-2 text-danger" />
        </>
    );
});
