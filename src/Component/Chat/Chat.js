import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  InsertEmoticon,
  MoreVert,
  SearchOutlined,
} from "@material-ui/icons";
import MicOutlinedIcon from "@material-ui/icons/MicOutlined";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./Chat.css";
import db from "../../firebase";
import { useStateValue } from "../../StateProvider";

const Chat = ({ messages }) => {
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));
    }
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post("https://blooming-sea-28460.herokuapp.com/messages/new", {
      message: input,
      name: user?.displayName,
      timestamp: new Date().toUTCString(),
      received: false,
    });

    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar></Avatar>

        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>Last seen... </p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined></SearchOutlined>
          </IconButton>
          <IconButton>
            <AttachFile></AttachFile>
          </IconButton>
          <IconButton>
            <MoreVert></MoreVert>
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${
              message.name === user.displayName && "chat__receiver"
            }`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">{message.timestamp}</span>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <InsertEmoticon></InsertEmoticon>
        <form>
          <input
            placeholder="Type a message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicOutlinedIcon></MicOutlinedIcon>
      </div>
    </div>
  );
};

export default Chat;
