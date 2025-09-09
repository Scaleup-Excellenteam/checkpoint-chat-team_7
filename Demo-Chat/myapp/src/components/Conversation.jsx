import { Button, Card, FormControl, InputGroup } from "react-bootstrap";
import chatperson from "../Images/chat_person.png";
import { serverURL, WS_URL } from "../constants/APIs";
import { Send } from "react-bootstrap-icons";
import Message from "./Message";
import { useEffect, useMemo, useState } from "react";
import useWebSocket from "react-use-websocket";
import { validateFrontendMessage } from "../constants/purify";

const Conversation = ({ conversation, refreshconversations }) => {
  const ws_url = WS_URL;

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
      if (parsed.type !== "MESSAGE") {
        alert("Bad Text: ");
        return;
      }

      if (parsed.sender === sessionStorage["username"]) {
        return;
      }
      setallmessages([...allmessages, { ...parsed }]);
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    const isValid = validateFrontendMessage(message, useEffect, useState);

    if (isValid.safe) {
      setallmessages([
        ...allmessages,
        {
          text: isValid.text,
          sender: sessionStorage["username"],
          senderId: sessionStorage["userId"],
          groupId: conversation._id,
        },
      ]);
      sendJsonMessage({
        text: isValid.text,
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
      <Card className="conversation">
        {conversation ? (
          <>
            <Card className="conversation-header">
              <img src={chatperson} alt="" />
              <h5>{conversation?.groupName}</h5>
            </Card>
            <Card className="allmessages">
              {allmessages?.length > 0 ? (
                allmessages.map((msg, index) => {
                  return <Message key={index} msg={msg} />;
                })
              ) : (
                <div className="empty-conversation">
                  <h5>No messages yet</h5>
                  <p>Start the conversation by sending a message!</p>
                </div>
              )}
            </Card>
            <div className="message-input-container">
              <FormControl
                className="formcontrol"
                placeholder="Type your message..."
                value={message}
                aria-label="Type your message..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button
                className="send-button"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send size={20} />
              </Button>
            </div>
          </>
        ) : (
          <div className="empty-conversation">
            <h5>Select a conversation</h5>
            <p>Choose a conversation from the sidebar to start chatting!</p>
          </div>
        )}
      </Card>
    </>
  );
};

export default Conversation;
