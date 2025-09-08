import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Button, Card } from "react-bootstrap";
import NewConversationDetails from "./NewConversationDetails";
import { X } from "react-bootstrap-icons";
import { serverURL } from "../constants/APIs";

const NewConversation = ({ getuser, closecomp }) => {
  const conversationUrl = serverURL + "conversations";
  const [groupName, setgroupName] = useState("");

  const makeGroup = async () => {
    const newGroup = {
      groupName,
      groupAdmin: sessionStorage["username"],
      groupAdminId: sessionStorage["userId"],
    };
    const resp = await axios.post(conversationUrl, newGroup);
    if (resp.status !== 200) {
      alert("Group alredy exists!!!");
    }
    alert("Group Created Successfuly!");
    closecomp();
    window.location.reload();
  };

  return (
    <>
      <Card className="newconversation p-3">
        <X size={25} onClick={() => closecomp(false)} cursor="pointer" />

        <Card className="text-center" style={{ border: "unset" }}>
          <Card.Text className="h5">New Group</Card.Text>
        </Card>
        <hr />
        <Card
          style={{
            height: "100%",
            display: "flex",
            border: "none",
            justifyContent: "center",
          }}
        >
          <Card className="align-items-center" style={{ border: "unset" }}>
            <input
              type="text"
              placeholder="Group Name"
              onChange={(e) => setgroupName(e.target.value)}
              style={{ width: "50%" }}
            />
          </Card>
          <Card className="align-items-center mt-5" style={{ border: "unset" }}>
            <Button onClick={makeGroup}>Make Group</Button>
          </Card>
        </Card>
      </Card>
    </>
  );
};

export default NewConversation;
