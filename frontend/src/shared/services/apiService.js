import axios from 'axios';

const apiService = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3005',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: 모든 요청에 JWT 토큰을 추가
apiService.interceptors.request.use(
    (config) => {
        // 토큰은 로그인 성공 시 localStorage나 다른 전역 상태에 저장되어 있을 것으로 가정합니다.
        const token = localStorage.getItem('accessToken'); // 또는 'jwt_token' 등 실제 저장된 키 값으로 변경

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (기존 코드 유지)
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
