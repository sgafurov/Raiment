import React, { useEffect, useRef, useState } from "react";
import { query, collection, onSnapshot, where } from "firebase/firestore";
import { dbFirestone } from "../../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/userSlice";
import { useParams } from "react-router-dom";
import { ref, get, off } from "firebase/database";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { storage } from "../../firebase";
import Carousel from "react-bootstrap/Carousel";
import uuid from "react-uuid";

export default function ChatBox() {
  const { params } = useParams();
  const parts = params.split(":");
  const seller = parts[0];
  const key = parts[1];

  const [messages, setMessages] = useState([]);
  const [post, setPost] = useState();
  const [imageURLArray, setImageURLArray] = useState([]); // contains the URL of the image

  const user = useSelector(selectUser);

  useEffect(() => {
    console.log("fetched messages", messages);
  }, [messages]);

  useEffect(() => {
    const db = firebase.database();
    const dataRef = ref(db, `listings/${seller}/${key}`);
    console.log("listing id", key);
    get(dataRef)
      .then((snapshot) => {
        const data = snapshot.val();
        console.log("post data", data);
        setPost(data);
        const names = data.images.map((image) => image.name);
        console.log("names", names);
        getImageUrl(names);
        console.log("data.images", data.images);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });

    const getImageUrl = async (names) => {
      try {
        for (let i = 0; i < names.length; i++) {
          const imageRef = storage.ref().child(names[i]);
          const url = await imageRef.getDownloadURL();
          console.log("getting image url for", names[i]);
          names[i] = url;
        }
        console.log("names urlArray", names);
        setImageURLArray(names);
      } catch (error) {
        console.log("Error getting image URL:", error);
      }
    };

    off(dataRef);

    const userInboxRef = collection(
      dbFirestone,
      `messages/${user.username}/inbox/` // gets every single message in this user's inbox
    );

    const singleMessagesQuery = query(
      userInboxRef,
      where("postKey", "==", key) // only gets messages that match the postKey of the currently selected post
    );

    const unsubscribe = onSnapshot(singleMessagesQuery, (QuerySnapshot) => {
      const fetchedMessages = [];
      console.log("QuerySnapshot", QuerySnapshot);
      if (QuerySnapshot.size === 0) {
        // No matches found. Create a convoId so all messages sent are linked to this convo
        console.log("no messages found for this listing. creating new convoId");
      }
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
        // console.log("doc.convoId", doc.data().convoId);
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe; 
  }, []);

  return (
    <main className="chat-box">
      {post && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Carousel interval={null} style={{ width: "120px", height: "120px" }}>
            {imageURLArray.map((url, index) => {
              const imageKey = `image-${index}-${key}`;
              return (
                <Carousel.Item key={imageKey}>
                  <img className="d-block w-100" src={url} alt="" />
                </Carousel.Item>
              );
            })}
          </Carousel>
          <h1>{post.title}</h1>
        </div>
      )}
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <SendMessage postKey={key} />
    </main>
  );
}
