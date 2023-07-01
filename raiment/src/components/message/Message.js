import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";

export default function Message({ message }) {
  const user = useSelector(selectUser);

  useEffect(() => {
    console.log("message", message);
  }, []);
  return (
    <div
      className={`chat-bubble ${
        message.sender === user.username ? "right" : ""
      }`}
    >
      <div className="chat-bubble__right">
        <p className="user-name">{message.sender}</p>
        <p className="user-message">{message.text}</p>
      </div>
    </div>
  );
}
