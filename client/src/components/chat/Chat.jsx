import React, { useEffect } from "react";
import ChatWIndow from "../ChatWIndow";
import SideBar from "../SideBar";
import { userStore } from "../../lib/userStore";
import { useNavigate } from "react-router-dom";

function Chat() {
  const { user } = userStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);
  return (
    <div className="h-[90vh] flex m-10 bg-[rgba(30,33,34,0.75)] backdrop-blur-2xl backdrop-saturate-50 backdrop-opacity-50 rounded-xl border-[#495057] border-4 overflow-hidden space-x-3">
      <SideBar />
      <ChatWIndow />
    </div>
  );
}

export default Chat;
