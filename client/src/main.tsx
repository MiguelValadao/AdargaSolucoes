import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Sobre from "./pages/Sobre";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function Public({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <Public>
            <Home />
          </Public>
        }
      />
      <Route
        path="/catalogo"
        element={
          <Public>
            <Catalogo />
          </Public>
        }
      />
      <Route
        path="/sobre"
        element={
          <Public>
            <Sobre />
          </Public>
        }
      />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </BrowserRouter>
);