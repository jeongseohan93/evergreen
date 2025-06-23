import axios from 'axios';

const apiService = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3005',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiService.interceptors.response.use(
    (response) => response,
    async (error) => {
        if( error.response && error.response.status === 401 ) {
            // 보호된 경로에서만 리다이렉트
            const protectedPaths = ['/mypage', '/cart', '/order', '/admin']; // 필요시 추가
            const isProtected = protectedPaths.some(path => window.location.pathname.startsWith(path));
            if (isProtected && window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiService;