import React from "react";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { authUser } = useAuthContext();

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={authUser ? <Navigate to="/" /> : <Auth />}
        />
      </Routes>
    </>
  );
}

export default App;
