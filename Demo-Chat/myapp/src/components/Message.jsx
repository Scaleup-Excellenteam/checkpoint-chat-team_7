import { Card } from "react-bootstrap";
import chatperson from "../Images/chat_person.png";

const Message = ({ msg }) => {
  const myUsername = sessionStorage["username"];
  const senderName = msg.sender;
  return (
    <>
      {senderName === myUsername ? (
        <Card className="message ms-auto">
          <strong>{msg.sender}</strong>
          <span>{msg.text}</span>
          <div className="timestamp">{msg.sentAt}</div>
        </Card>
      ) : (
        <div className="message-container">
          <img src={chatperson} alt="" />
          <Card className="message me-auto">
            <strong>{msg.sender}</strong>
            <span>{msg.text}</span>
            <div className="timestamp">{msg.sentAt}</div>
          </Card>
        </div>
      )}
    </>
  );
};

export default Message;
