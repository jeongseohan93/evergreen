// 라우팅을 담당하는 컴포넌트 (여러 페이지 이동용)
import AppRoutes from './routes';

// App 컴포넌트: 앱 전체의 시작점이자, 전역 설정을 담당
function App() {
  return (
    <div>
       {/* 실제 페이지 라우팅 처리는 AppRoutes에서 */}
      <AppRoutes />
    </div>
  );
}

export default App;
