import React from 'react';

const Button = ( { Children, onClick, type = 'button', className = '', ...props}) => {
    const baseStyles = 'py-2 px-4 rounded transition duration-200 ease-in-out';
    const combinedClassName = `${baseStyles} ${className}` 
    return (
       <button 
        type={type}
        onClick={onClick}
        className={combinedClassName}
        {...props}
        >
        {Children}
        </button>
    );
};

export default Button;