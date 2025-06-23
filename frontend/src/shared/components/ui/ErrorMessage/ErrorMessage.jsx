import React from 'react';

const ErrorMessage = ( { message, className = '' }) => {
    if(!message) return null;
    return (
        <p className={`text-red-500 text-sm ${className}`}>
            {message}
        </p>
    )
}
export default ErrorMessage;