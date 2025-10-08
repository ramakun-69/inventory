export default function ErrorMessage({ message, className = '', ...props }) {
    return message ? (
        <div 
            {...props}
            className={`text-danger  ${className}`}
        >
            {message}
        </div>
    ) : null;
}
