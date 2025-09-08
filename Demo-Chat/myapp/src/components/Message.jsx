import { Card } from "react-bootstrap";
import chatperson from "../Images/chat_person.png";

const Message = ({ msg }) => {
  const myUsername = sessionStorage["username"];
  const senderName = msg.sender;
  return (
    <>
      {senderName === myUsername ? (
        <Card className="message px-2 p-1 ms-auto mt-2">
          <div>
            <strong>{msg.sender}</strong>
          </div>
          <span>{msg.text}</span>
          <div>{msg.sentAt}</div>
        </Card>
      ) : (
        <Card className="flex-row p-1" style={{ border: "unset" }}>
          <img
            src={chatperson}
            alt=""
            style={{ width: "45px", height: "45px" }}
          />
          <Card className="message ms-1 px-2  p-1 me-auto">
            <div>
              <strong>{msg.sender}</strong>
            </div>
            <span>{msg.text}</span>
            <div>{msg.sentAt}</div>
          </Card>
        </Card>
      )}
    </>
  );
};

export default Message;
