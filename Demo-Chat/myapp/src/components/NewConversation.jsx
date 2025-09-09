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
      <Card className="newconversation">
        <button className="close-button" onClick={() => closecomp(false)}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <Card.Text className="h5">New Group</Card.Text>
        </div>

        <div className="modal-body">
          <div className="input-container">
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setgroupName(e.target.value)}
            />
          </div>
          <div className="button-container">
            <Button
              className="btn btn-secondary"
              onClick={() => closecomp(false)}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-primary"
              onClick={makeGroup}
              disabled={!groupName.trim()}
            >
              Create Group
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default NewConversation;
