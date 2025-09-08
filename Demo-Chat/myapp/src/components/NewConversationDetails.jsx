import { Card } from "react-bootstrap";
import { Send } from "react-bootstrap-icons";
import chatperson from "../Images/chat_person.png";

const NewConversationDetails = ({ user, getuser }) => {
  return (
    <>
      <Card
        className="flex-row my-1 w-50 new-conversation-details-card"
        onClick={() => getuser(user)}
      >
        <Card className="p-1 bg-transparent" style={{ border: "unset" }}>
          <img src={chatperson} alt="" style={{ width: "45px" }} />
        </Card>
        <Card className="px-1 bg-transparent" style={{ border: "unset" }}>
          <Card.Text className="text-uppercase m-auto">{user.name}</Card.Text>
        </Card>
      </Card>
    </>
  );
};

export default NewConversationDetails;
