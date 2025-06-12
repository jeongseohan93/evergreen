// src/App.jsx
import React from 'react';
import { Provider } from 'react-redux'; // Redux Provider를 임포트
import { store } from './stores';      // Redux 스토어를 임포트 (src/stores/index.js에서 내보낸 것)

// routes.jsx에서 내보내는 컴포넌트를 임포트합니다.
// 보통 'AppRoutes'나 'RouterComponent' 등으로 이름을 짓습니다.
// 파일 이름이 routes.jsx이니, export default 한 컴포넌트의 이름이 무엇인지 확인하고 임포트하세요.
// 여기서는 `AppRoutes`라고 가정하겠습니다.
import AppRoutes from './routes';

function App() {
  return (
    // Redux Provider로 애플리케이션의 전체 컴포넌트 트리를 감쌉니다.
    // 이렇게 하면 AppRoutes와 그 안에 렌더링되는 모든 컴포넌트들이 Redux 스토어에 접근할 수 있습니다.
    <Provider store={store}>
      {/* React.StrictMode는 개발 모드에서 잠재적인 문제를 감지하는 데 도움을 줍니다. */}
      {/* 프로덕션 빌드에는 포함되지 않습니다. */}
      <React.StrictMode>
        {/* routes.jsx에서 정의된 라우팅 로직을 가진 컴포넌트 */}
        <AppRoutes />
      </React.StrictMode>
    </Provider>
  );
}

export default App;