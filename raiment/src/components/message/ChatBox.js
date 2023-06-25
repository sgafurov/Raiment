import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  doc,
  orderBy,
  onSnapshot,
  limit,
  where,
} from "firebase/firestore";
import { dbFirestone } from "../../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const user = useSelector(selectUser);

  useEffect(() => {
    console.log("fetched messages", messages);
  }, [messages]);

  useEffect(() => {
    const userInboxRef = collection(
      dbFirestone,
      `messages/${user.username}/inbox/` // gets every single message in this user's inbox
    );

    const singleMessagesQuery = query(
      userInboxRef,
      where("convoId", "==", "asadadasdasd") // filters messages based on convo id
    );
    const unsubscribe = onSnapshot(singleMessagesQuery, (QuerySnapshot) => {
      const fetchedMessages = [];
      console.log("QuerySnapshot", QuerySnapshot);
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe;

    // old code
    // const messagesQuery = query(
    //   // collection(dbFirestone, "messages"),
    //   testUserRef,
    //   orderBy("createdAt", "asc"), //desc
    //   limit(50)
    // );
    // const unsubscribe = onSnapshot(messagesQuery, (QuerySnapshot) => {
    //   const fetchedMessages = [];
    //   console.log("QuerySnapshot", QuerySnapshot);
    //   QuerySnapshot.forEach((doc) => {
    //     fetchedMessages.push({ ...doc.data(), id: doc.id });
    //   });
    //   const sortedMessages = fetchedMessages.sort(
    //     (a, b) => a.createdAt - b.createdAt
    //   );
    //   setMessages(sortedMessages);
    // });
    // return () => unsubscribe;
  }, []);

  return (
    <main className="chat-box">
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      <span ref={scrollRef}></span>
      <SendMessage scroll={scrollRef} />
    </main>
  );
}
