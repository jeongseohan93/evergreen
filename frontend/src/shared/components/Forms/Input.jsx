import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder = '', className = '', ...props }) => {
    return (
        <input 
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            {...props}
            />
    )

}

export default Input;