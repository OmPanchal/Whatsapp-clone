import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Modal,
} from "@material-ui/core";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import React, { useEffect, useState } from "react";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import "./Chat.css";
import { Redirect, useParams } from "react-router";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import File from "./File";

const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useStateValue();
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [img, setImg] = useState("");
  const [dialogInput, setDialogInput] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageDialogMessage, setImageDialogMessage] = useState("");

  useEffect(() => {
    setInput("");
    setSeed(Math.floor(Math.random() * 500000));
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });
    }
    if (!roomId) {
      <Redirect to="/" />;
    }
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      src: img,
      uid: user.uid,
    });
    setInput("");
  };

  const sendMessageFromDialog = (e) => {
    e.preventDefault();

    if (dialogInput) {
      db.collection("rooms").doc(roomId).collection("messages").add({
        message: dialogInput,
        name: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        src: img,
        uid: user.uid,
      });
      setDialogInput("");
      setChatDialogOpen(false);
      setImg("");
    }
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`http://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen at{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toLocaleString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <div
            onClick={() => {
              setImg("");
              setDialogInput("");
              setChatDialogOpen(true);
            }}
          >
            <IconButton>
              <AttachFileIcon />
            </IconButton>
          </div>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body ">
        {messages.map((message, index) => {
          return (
            <div key={index}>
              <div
                style={{ width: message.src && "250px" }}
                className={`chat__message ${
                  message.uid === user.uid && "chat__reciever"
                }`}
              >
                <span className="chat__name">{message.name}</span>
                <div className="data__div">
                  {message.src && (
                    <img
                      src={message.src}
                      alt=""
                      className="chat__img"
                      onClick={() => {
                        setImageDialogOpen(true);
                        setImg(message.src);
                        setImageDialogMessage(message.message);
                      }}
                    />
                  )}
                  <div className="message__div">
                    {message.message}
                    <span className="chat__timestamp">
                      {new Date(
                        message.timestamp?.toDate()
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form action="">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            type="text"
            placeholder="Type a Message "
          />
          <button onClick={sendMessage}>Send a Message</button>
        </form>
        <MicIcon />
      </div>

      <Dialog
        style={{ padding: "none" }}
        open={chatDialogOpen}
        onClose={() => {
          setImg("");
          setDialogInput("");
          setChatDialogOpen(false);
          setImageDialogMessage("");
        }}
        onBackdropClick={() => {
          setImg("");
          setDialogInput("");
          setChatDialogOpen(false);
          setImageDialogMessage("");
        }}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle className="dialog__title">
          <strong>Image Preview</strong>
          <Button onClick={sendMessageFromDialog}>Send </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <File
            img={img}
            setImg={setImg}
            dialogInput={dialogInput}
            setDialogInput={setDialogInput}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        className="Dialog"
        open={imageDialogOpen}
        onClose={() => {
          setImageDialogOpen(false);
          setImg("");
          setDialogInput("");
          setImageDialogMessage("");
        }}
        onBackdropClick={() => {
          setImageDialogOpen(false);
          setImg("");
          setImg("");
          setDialogInput("");
          setImageDialogMessage("");
        }}
      >
        <img className="dialog__image" src={img} alt="" />
        <Divider />
        <DialogContent className="view__dialogContent">
          <p>{imageDialogMessage}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
