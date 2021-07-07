import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import db from "./firebase";

import "./SidebarChat.css";

const SidebarChat = ({ id, name }) => {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");
  const [shortMessage, setShortMessage] = useState("");

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 500000));
  }, []);

  // Todo: 🔽 Don't forget that code at the bottom

  useEffect(() => {
    setShortMessage("");
    if (messages[0]?.message.length > 50) {
      const arr = [];
      const splitMessage = messages[0]?.message.split("");
      splitMessage.map((item, index) => {
        if (index < 50) {
          arr.push(item);
          setShortMessage(arr.join("") + "...");
        }
      });
      console.log(shortMessage);
    }
    if (messages[0]?.message.length <= 50) {
      setShortMessage(messages[0]?.message);
    }
  }, [messages]);

  return (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`http://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{shortMessage}</p>
        </div>
      </div>
    </Link>
  );
};

export default SidebarChat;
