import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import WebMaintenanceForm from "./WebMaintenanceForm";
import AdminPage from "./AdminPage";
import ThankYou from "./ThankYou";
import PageNotFound from "./PageNotFound";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/web-maintenance-form/:clientId"
            element={<WebMaintenanceForm />}
          />
          <Route
            path="/admin-page/6b66fb29e40b7bb2513aab8ef3132f3a7e1e7a0ba16fce846044139dff29a0087a5044fb31bb095b1fedcb37e4d84cced6046c6b5c3b4ac79d94530ee32c0f6ddd705d4e7f4e584d26c74ad144f0669de3127fd56f20ae8679252a225e0aa6f6c183d97e8548467a0d3e43a459e7021c9bfe732cbbe003e67bdfbb67f578eb945db32665e9237fb36730daf0174c3810f118e02d5495135be37735da1fb6b6dc"
            element={<AdminPage />}
          />
          <Route path="/thank-you/:form_uri" element={<ThankYou />} />
          <Route path="page-not-found" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
