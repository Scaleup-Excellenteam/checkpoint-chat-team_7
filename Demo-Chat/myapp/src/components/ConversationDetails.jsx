import { Card } from "react-bootstrap";
import chatperson from "../Images/chat_person.png";
import { useState } from "react";

const ConversationDetails = ({ con, activeconv, getconid }) => {
  const [lastMessage, setlastMessage] = useState(
    con?.messages[con.messages.length - 1]?.msg
  );

  return (
    <>
      <Card
        className={
          activeconv === con.with
            ? "conversation-details bg-primary"
            : "conversation-details"
        }
        onClick={() => getconid(con)}
      >
        <div className="avatar-container">
          <img src={chatperson} alt="" />
        </div>
        <div className="conversation-info">
          <h6>{con.groupName}</h6>
          <p className="last-message">{lastMessage || "No messages yet"}</p>
        </div>
      </Card>
    </>
  );
};

export default ConversationDetails;
