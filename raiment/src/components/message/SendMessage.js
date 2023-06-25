import React, { useState } from "react";
import { auth, dbFirestone } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";

export default function SendMessage({ postKey, postTitle, seller }) {
  const user = useSelector(selectUser);
  const [message, setMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    if (postKey && seller) {
      await addDoc(collection(dbFirestone, `messages/${user.username}/inbox`), {
        text: message,
        username: user.username,
        createdAt: serverTimestamp(),
        postKey,
        postTitle,
        seller
      });
    }
    setMessage("");
  };

  return (
    <form onSubmit={(e) => sendMessage(e)} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        name="messageInput"
        type="text"
        placeholder="Send a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
