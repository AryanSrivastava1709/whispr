import React from "react";
import { messageStore } from "../lib/messageStore";
import { userStore } from "../lib/userStore";

function ChatWIndow() {
  const { sender, receiver, messages } = messageStore();
  const { user } = userStore();
  // renders only when user receiver and message is not empty
  return user && receiver && messages ? (
    <div className="w-[75rem] bg-primary m-10  rounded-xl">
      <div className="text-black text-3xl font-bold flex flex-row m-10 items-center justify-between bg-white p-4 rounded-3xl shadow-lg shadow-black">
        <div className=" flex flex-row items-center space-x-6">
          <img
            src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
            className=" h-16 w-16 rounded-full"
            alt="userimage"
          />
          <div>
            <p className="text-3xl">{receiver.username}</p>
            <p
              className={`text-lg font-semibold animate-pulse ${
                receiver.status === "AVAILABLE"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {receiver.status}
            </p>
          </div>
        </div>
      </div>

      <div className="text-black font-bold m-10 bg-white p-4 rounded-3xl shadow-lg shadow-black max-h-96 overflow-y-scroll">
        {messages.map((message, index) =>
          message.sender.username === user.username ? (
            <div key={index} className="flex flex-col m-6 w-[1000px] items-end">
              <div className="bg-gray-400 rounded-3xl px-4 py-2">
                <p className="">{message.content}</p>
              </div>
              <p className="text-sm pr-2 text-gray-500">
                {message.sender.username} {message.timestamp}
              </p>
            </div>
          ) : (
            <div
              key={index}
              className="flex flex-col m-6 w-[1000px] items-start"
            >
              <div className="bg-blue-400 rounded-3xl px-4 py-2">
                <p className="">{message.content}</p>
              </div>
              <p className="text-sm pl-2 text-gray-500">
                {message.sender.username} {message.timestamp}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  ) : null;
}

export default ChatWIndow;
