import { Button, Card, FormControl, InputGroup } from "react-bootstrap";
import chatperson from "../Images/chat_person.png";
import { serverURL, WS_URL } from "../constants/APIs";
import { Send } from "react-bootstrap-icons";
import Message from "./Message";
import { useEffect, useMemo, useState } from "react";
import useWebSocket from "react-use-websocket";

const Conversation = ({ conversation, refreshconversations }) => {
  const ws_url = WS_URL;
  const userURL = serverURL + "users";

  const [message, setMessage] = useState("");
  const [allmessages, setallmessages] = useState([]);

  useEffect(() => {
    if (conversation?.messages) {
      setallmessages(conversation.messages);
    }
  }, [conversation]);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(ws_url, {});

  useMemo(() => {
    if (readyState) {
      sendJsonMessage({ type: "LOGIN", _id: sessionStorage["userId"] });
    }
  }, [readyState]);

  useMemo(() => {
    if (lastMessage !== null) {
      const parsed = JSON.parse(lastMessage.data);
      if (parsed.sender === sessionStorage["username"]) {
        return;
      }
      setallmessages([...allmessages, { ...parsed }]);
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      setallmessages([
        ...allmessages,
        {
          text: message,
          sender: sessionStorage["username"],
          senderId: sessionStorage["userId"],
          groupId: conversation._id,
        },
      ]);
      sendJsonMessage({
        text: message,
        sender: sessionStorage["username"],
        senderId: sessionStorage["userId"],
        groupId: conversation._id,
        type: "MESSAGE",
      });
    }
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      <Card className="conversation  mt-4">
        <Card
          className="flex-row p-1 bg-light"
          style={{ border: "unset", borderRadius: "unset" }}
        >
          <img src={chatperson} alt="" style={{ width: "60px" }} />
          <h5 className="ms-2 my-auto text-uppercase">
            {conversation?.groupName}
          </h5>
        </Card>
        <Card className="allmessages px-2">
          {allmessages?.map((msg, index) => {
            return <Message key={index} msg={msg} />;
          })}
        </Card>
        {conversation && (
          <InputGroup className="mt-auto">
            <FormControl
              className="formcontrol"
              placeholder="Type your text..."
              value={message}
              aria-label="Type your text..."
              aria-describedby="basic-addon2"
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                borderRadius: "unset",
                border: "1px solid rgb(210, 207, 207)",
                borderBottom: "unset",
                borderLeft: "unset",
              }}
            />
            <Button
              className="px-3 bg-transparent send-button"
              id="button-addon2"
              onClick={handleSendMessage}
              style={{
                borderRadius: "unset",
                border: "1px solid rgb(210, 207, 207)",
                borderBottom: "unset",
                borderRight: "unset",
              }}
            >
              <Send size={20} style={{ color: "#3B71CA" }} />
            </Button>
          </InputGroup>
        )}
      </Card>
    </>
  );
};

export default Conversation;
