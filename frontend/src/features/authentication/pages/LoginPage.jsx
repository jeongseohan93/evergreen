import { useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import { useSlelector } from 'react-redux';
import MenuBar from '@/shared/components/layouts/MenuBar/MenuBar';

import { Header, SubHeader, Footer } from '@/app';
import LoginForm from '../components/LoginForm'

const LoginPage = () => {
    const navigate = useNavigate();
    const isLoggedIn = null;

    useEffect(() => {
        if(isLoggedIn) {
            navigate('/');
        }
    },[isLoggedIn, navigate]);
    
    return (
        <>
            <Header />
            <SubHeader />
            <MenuBar />

            <div className="flex justify-center items-center min-h-[500px] bg-white">
                <LoginForm />
            </div>

            <Footer />
        </>
    );
};

export default LoginPage;