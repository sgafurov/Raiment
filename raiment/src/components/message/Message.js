import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";

export default function Message({ message }) {
  const user = useSelector(selectUser);

  return (
    <div
      className={`chat-bubble ${
        message.username === user.username ? "right" : ""
      }`}
    >
      <div className="chat-bubble__right">
        <p className="user-name">{message.username}</p>
        <p className="user-message">{message.text}</p>
      </div>
    </div>
  );
}
