import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import { CallContextProvider } from "./context/CallContext";
import CallModal from "./components/custom/CallModal";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <BrowserRouter>
      <StrictMode>
        <SocketContextProvider>
          <CallContextProvider>
            <App />
            <CallModal />
          </CallContextProvider>
        </SocketContextProvider>
      </StrictMode>
    </BrowserRouter>
  </AuthContextProvider>
);
