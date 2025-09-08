import { Button, Card } from "react-bootstrap";
import SearchPeople from "./SearchPeople";
import { ArrowLeft, ArrowRightShort } from "react-bootstrap-icons";
import useWebSocket from "react-use-websocket";
import axios, { all } from "axios";
import { useState } from "react";
import chatperson from "../Images/chat_person.png";

const Forward = ({
  allconversations,
  allUsers,
  msgtoforward,
  setmsgforward,
  block,
  forwardedFrom,
}) => {
  const WS_URL = import.meta.env.VITE_WEBSOCKET_URL;
  const [confirmSending, setconfirmSending] = useState(false);
  const [forwardto, setforwardto] = useState("");
  const [forwardto_id, setforwardto_id] = useState("");

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {});
  const forward = () => {
    sendJsonMessage({
      type: "friend",
      message: msgtoforward.msg,
      _id: forwardto_id,
      from: sessionStorage["userId"],
      isblocked: block ? "YES" : "NO",
      forwarded: true,
    });
    setmsgforward("");
  };

  return (
    <>
      <Card
        className={msgtoforward ? "forward-card-active p-2" : "forward-card"}
      >
        <Card.Text className="me-auto">
          <ArrowLeft
            size={25}
            onClick={() => setmsgforward("")}
            cursor="pointer"
          />
        </Card.Text>
        <Card.Text className="h5">Forward</Card.Text>
        <SearchPeople />
        <Card
          style={{ overflowY: "auto", border: "unset" }}
          className="px-1 align-items-center"
        >
          {allconversations?.map((con, index) => {
            return (
              con.with !== forwardedFrom && (
                <Card
                  className="conv px-2 my-2 py-2 w-50 flex-row"
                  key={index}
                  onClick={() => {
                    setforwardto(con.name);
                    setconfirmSending(true);
                    setforwardto_id(con.with);
                  }}
                >
                  <div>
                    <img src={chatperson} alt="" style={{ width: "60px" }} />
                  </div>
                  <div className="ms-2">
                    <Card.Text className="h6 text-uppercase">
                      {con.name}
                    </Card.Text>
                    <Card.Text className="text-muted ">
                      {con.conversation[con.conversation.length - 1]?.msg}
                    </Card.Text>
                  </div>
                </Card>
              )
            );
          })}
        </Card>
        {confirmSending && (
          <Card className="p-4 confirm text-center">
            <Card.Text>Forward to {forwardto.toUpperCase()}</Card.Text>
            <div className="py-2">
              <Button onClick={forward}>Forward</Button>
              <Button
                className="ms-1"
                onClick={() => {
                  setconfirmSending(false);
                  setforwardto("");
                  setforwardto_id("");
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}
      </Card>
    </>
  );
};

export default Forward;
