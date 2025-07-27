import React from 'react';
import { Link } from 'react-router-dom';

const WishlistIcon = ({ wishlistItemCount }) => {
    return (
        <Link to="/wishlist" aria-label="Wishlist" className="relative text-black-600 hover:text-blue-500 transition-colors">
            <svg
                className="w-10 h-10 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                fill="black"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
            </svg>
            {wishlistItemCount > 0 && (
                // ⭐ 여기를 수정했습니다 ⭐
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1/5 -translate-y-1/5">
                    {wishlistItemCount}
                </span>
            )}
        </Link>
    );
};

export default WishlistIcon;