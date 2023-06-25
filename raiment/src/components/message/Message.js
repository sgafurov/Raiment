import React from "react";
import { auth } from "../../firebase";
// import { useAuthState } from "react-firebase-hooks/auth";

export default function Message({ message }) {
//   const [user] = useAuthState(auth);
  return (
    <div
      //className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}
      className={`chat-bubble__right`}
      >
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.username}</p>
        <p className="user-message">{message.text}</p>
      </div>
    </div>
  );
};