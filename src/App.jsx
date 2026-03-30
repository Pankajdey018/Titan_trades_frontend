import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import LandingPage from "./pages/public/LandingPage.jsx";
import LoginPage from "./pages/public/LoginPage.jsx";
import RegisterPage from "./pages/public/RegisterPage.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
