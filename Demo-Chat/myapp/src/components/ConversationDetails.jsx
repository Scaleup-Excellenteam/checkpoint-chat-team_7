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
            ? "flex-row conversation-details py-4 bg-primary"
            : "flex-row conversation-details py-4"
        }
        onClick={() => getconid(con)}
      >
        <div className="p-1">
          <img src={chatperson} alt="" style={{ width: "50px" }} />
        </div>
        <div className="p-1">
          <h6>{con.groupName}</h6>
          <p className="text-muted">{lastMessage}</p>
        </div>
      </Card>
    </>
  );
};

export default ConversationDetails;
