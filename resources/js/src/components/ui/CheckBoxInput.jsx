import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ErrorMessage from './ErrorMessage';

export default forwardRef(function CheckBoxInput(
    { type = 'checkbox', className = '', isFocused = false, errorMessage, label, errorInput = true, ...props },
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
                className={`form-check-input ${className} ${localError ? 'is-invalid' : ''}`}
                id={props.id}
                ref={localRef}
                onChange={handleChange}
            />

            {label && (
                <label className='form-check-label' htmlFor={props.id}>
                    {label}
                </label>
            )}
            {props.errorInput && <ErrorMessage message={localError} className="mt-2 text-danger" />}
        </>
    );
});
