import React, { useState } from "react";
import { auth, dbFirestone } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";

export default function SendMessage({ scrollRef }) {
  const user = useSelector(selectUser);
  const [message, setMessage] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    await addDoc(collection(dbFirestone, "messages/"), {
      text: message,
      // name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
      username: user.username
    });
    setMessage("");
    // when a new message enters the chat, the screen scrolls down to the scroll div in ChatBox
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
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
