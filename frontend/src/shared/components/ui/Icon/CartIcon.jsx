import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const CartIcon = ({ cartItemCount }) => {
  return (
    <Link to="/cart" className="relative text-black-600 hover:text-blue-500 transition-colors">
      <FaShoppingCart className="text-3xl" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
          {cartItemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;