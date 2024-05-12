import { useEffect } from "react";
import Loader from "./components/Loader";
import Login from "./components/login/Login";
import { Toaster } from "react-hot-toast";
import { userStore } from "./lib/userStore";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./components/signup/SignUp";
import Chat from "./components/chat/Chat";

function App() {
  const { user, isLoading } = userStore();
  useEffect(() => {
    console.log(user);
  }, [user]);
  return isLoading ? (
    <Loader />
  ) : (
    <div className="font-Inter">
      <Toaster position="top-left" reverseOrder={true} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign" element={<SignUp />} />
          <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
