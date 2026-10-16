import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Home from "./features/home/pages/Home";
import NotFound from "./components/layout/NotFound";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
