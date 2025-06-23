import React from "react";
import { Link } from "react-router-dom";

const EvergreenLogo = () => {
    return (
        <Link to='/'>
            <p className="text-black text-4xl font-aggro font-bold hover:text-blue-500">에버그린</p> 
        </Link>
       
    );
};

export default EvergreenLogo;