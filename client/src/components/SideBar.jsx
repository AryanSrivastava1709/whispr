import React, { useState } from "react";
import { userStore } from "../lib/userStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { messageStore } from "../lib/messageStore";
function SideBar() {
  const navigate = useNavigate();
  const { user, updateUserFriends } = userStore();
  const { sender, receiver, fetchMessages } = messageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [searchResult, setSearchResult] = useState();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const setMessenger = (friendId) => {
    const friend = user.friends.find((friend) => friend._id === friendId);
    if (friend) {
      messageStore.setState({ receiver: friend, sender: user.id });
      console.log(sender);
      console.log(receiver);
      fetchMessages();
    }
  };

  const searchUser = async () => {
    const token = Cookies.get("token");
    try {
      const resposne = await axios.get(
        `http://localhost:3000/api/users/${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResult((c) => (c = resposne.data.username));
      setSearchQuery("");
      console.log(searchQuery);
    } catch (error) {
      toast.error("User Not Found!!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 5000,
      });
    }
  };

  const addFriend = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/addfriend/${searchResult}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Friend Added Successfully", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 5000,
      });
      setSearchResult("");
      updateUserFriends(response.data.friend);
    } catch (error) {
      toast.error(error.response.message, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 5000,
      });
      console.log(error.message);
    }
  };

  const logoutHandler = async () => {
    const token = Cookies.get("token");
    try {
      const email = user.email;
      const res = await axios.post(
        "http://localhost:3000/api/users/logout",
        {
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("You logged out successfully", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 5000,
      });
      Cookies.remove("token");
      localStorage.removeItem("user-storage");
      window.location.reload();
    } catch (err) {
      toast.error("You are not authenticated", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 5000,
      });
    }
  };

  const statusChangeHandler = async () => {
    const token = Cookies.get("token");
    if (user.status === "AVAILABLE") {
      user.status = "BUSY";
    } else {
      user.status = "AVAILABLE";
    }
    const status = user.status;
    try {
      const reponse = await axios.post(
        "http://localhost:3000/api/users/status",
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`You are now in ${status} state`, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 5000,
      });
    } catch (err) {
      toast.error(`You are already in ${status} state`, {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        duration: 5000,
      });
    }
  };

  return (
    <div className="w-[32rem] bg-primary m-10  rounded-xl">
      <div className="text-black text-3xl font-bold flex flex-row m-10 items-center justify-between bg-white p-4 rounded-3xl shadow-lg shadow-black">
        <div className="flex flex-row space-x-5 items-center">
          <img
            src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
            className=" h-20 w-20 rounded-full"
            alt="userimage"
          />
          <h1>{user.username}</h1>
        </div>
        <div>
          <div>
            <label
              htmlFor="my_modal_7"
              className="btn btn-primary px-4 py-2 rounded-xl text-white cursor-pointer"
            >
              Add Friend
            </label>
            <input
              type="checkbox"
              id="my_modal_7"
              className="modal-toggle bg-primary"
            />
            <div className="modal" role="dialog">
              <div className="modal-box flex flex-col space-y-5">
                <h2 className="text-xl text-white ont-bold">Search User</h2>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="btn btn-primary text-white"
                  onClick={searchUser}
                >
                  Search
                </button>

                {searchResult && (
                  <div className="flex flex-row space-x-3 items-center justify-between px-7">
                    <div className="flex flex-row items-center space-x-4">
                      <img
                        src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
                        className=" h-12 w-12 rounded-full"
                        alt="userimage"
                      />
                      <p className="text-white text-xl">{searchResult}</p>
                    </div>
                    <button
                      className="btn btn-primary text-white"
                      onClick={addFriend}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
              <label className="modal-backdrop" htmlFor="my_modal_7">
                Close
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="text-black text-3xl font-bold flex flex-col m-10 bg-white p-4 rounded-3xl shadow-lg shadow-black overflow-y-scroll max-h-[480px]">
        {user.friends.map((friend) => (
          <div
            key={friend._id}
            className="p-3  flex-row flex items-center space-x-4 cursor-pointer border-b-2"
            onClick={() => setMessenger(friend._id)}
          >
            <img
              src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
              className=" h-20 w-20 rounded-full"
              alt="userimage"
            />
            <div>
              <p className="text-2xl">{friend.username}</p>
              <p
                className={`text-lg ${
                  friend.status === "AVAILABLE"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {friend.status}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex m-10 space-x-3">
        <button
          className="btn btn-error w-1/2 text-center text-xl text-white font-bold"
          onClick={logoutHandler}
        >
          Logout
        </button>
        <button
          className="btn btn-success w-1/2 text-center text-xl text-white font-bold"
          onClick={statusChangeHandler}
        >
          Change Status
        </button>
      </div>
    </div>
  );
}

export default SideBar;
