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

export default function SellerChatBox() {
  const { params } = useParams();
  const parts = params.split(":");
  const buyerName = parts[0];
  const sellerName = parts[1];
  const key = parts[2];

  const user = useSelector(selectUser);

  const [messages, setMessages] = useState([]);
  const [post, setPost] = useState();
  const [imageURLArray, setImageURLArray] = useState([]);
  const [seller, setSeller] = useState();
  const [buyer, setBuyer] = useState();

  useEffect(() => {
    console.log("fetched messages", messages);
    console.log("seller", seller);
    console.log("buyer", buyer);
  }, [messages, seller, buyer]);

  useEffect(() => {
    setSeller(user.username);
    setBuyer(buyerName);

    // get listing from Database and display its images and title
    const db = firebase.database();
    const dataRef = ref(db, `listings/${sellerName}/${key}`);
    console.log("sellerName", sellerName);
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

    // gets every single message in this user's inbox
    const userInboxRef = collection(
      dbFirestone,
      `messages/${user.username}/inbox/`
    );

    const singleMessagesQuery = query(
      userInboxRef,
      where("postKey", "==", key) // query only messages that match the postKey of the currently selected post
    );

    const unsubscribe = onSnapshot(singleMessagesQuery, (QuerySnapshot) => {
      const fetchedMessages = [];
      console.log("QuerySnapshot", QuerySnapshot);
      if (QuerySnapshot.size === 0) {
        console.log("no messages found for this listing");
      }
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
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
      <SendMessage
        postKey={key}
        buyer={buyer}
        seller={seller}
        postTitle={post?.title}
        sender={user.username}
        recipient={buyer}
      />
    </main>
  );
}
