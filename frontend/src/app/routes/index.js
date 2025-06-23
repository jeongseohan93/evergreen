// src/app/routes/index.js
import publicRoutes from './publicRoutes';
import appRoutes from './appRoutes';
import adminRoutes from './adminRoutes';

const allRoutes = [
  ...publicRoutes,
  ...appRoutes,
  ...adminRoutes,
  
];

export {
  publicRoutes,
  appRoutes,
  adminRoutes,
  allRoutes
};
