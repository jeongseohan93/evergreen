// src/app/routes.jsx
import { useRoutes } from 'react-router-dom';
import { allRoutes } from './routes/index'; // <- 정확히 이 경로로

const AppRoutes = () => {
  const element = useRoutes(allRoutes);
  return element;
};

export default AppRoutes;
