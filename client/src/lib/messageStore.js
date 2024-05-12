import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const messageStore = create(
  persist(
    (set, get) => ({
      sender: null,
      receiver: null,
      messages: [],
      fetchMessages: async () => {
        const token = Cookies.get("token");
        const receiverId = get().receiver._id;
        const sender = get().sender;
        if (receiverId || sender) {
          try {
            const res = await axios.get(
              `http://localhost:3000/api/chat/${sender}/${receiverId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            set({ messages: res.data });
            console.log(get().messages);
          } catch (err) {
            if (err.response) {
              toast.error(err.response.data.message, {
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              });
              set({ sender: null, receiverId: null, messages: [] });
            }
          }
        }
      },
    }),
    {
      name: "message-storage",
    }
  )
);
