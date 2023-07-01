import React, { useState } from "react";
import { auth, dbFirestone } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";

export default function SendMessage({
  postKey,
  buyer,
  seller,
  postTitle,
  sender,
  recipient,
}) {
  const user = useSelector(selectUser);
  const [message, setMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    if (postKey) {
      // add message to your inbox
      await addDoc(collection(dbFirestone, `messages/${sender}/inbox`), {
        text: message,
        createdAt: serverTimestamp(),
        postKey,
        postTitle,
        buyer,
        seller,
        sender,
        recipient
      });
      // add message to other person's inbox
      await addDoc(collection(dbFirestone, `messages/${recipient}/inbox`), {
        text: message,
        createdAt: serverTimestamp(),
        postKey,
        postTitle,
        buyer,
        seller,
        sender,
        recipient
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
