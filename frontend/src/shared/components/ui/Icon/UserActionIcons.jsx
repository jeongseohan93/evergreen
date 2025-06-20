import React from 'react';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const UserActionIcons = () => {
  return (
      <Link to="/mypage" className="text-black-600 hover:text-blue-500 transition-colors">
        <FaUser className="text-3xl" />
      </Link>
  );
};

export default UserActionIcons;