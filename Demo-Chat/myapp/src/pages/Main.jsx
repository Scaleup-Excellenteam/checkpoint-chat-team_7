import { Card, Dropdown } from "react-bootstrap";
import { WS_URL, serverURL } from "../constants/APIs";
import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AllConversations from "../components/AllConversations";
import { BoxArrowRight, Gear, ThreeDots } from "react-bootstrap-icons";
import Conversation from "../components/Conversation";
import NewConversation from "../components/NewConversation";
import axios from "axios";

const Main = () => {
  useEffect(() => {
    const access = async () => {
      try {
        const resp = await axios.get(`${serverURL}auth/access`, {
          headers: { xAccessToken: sessionStorage["accessToken"] },
        });
        if (resp.status === 200) {
          console.log("Access granted");
        } else {
          return window.location.replace("/");
        }
      } catch (error) {
        console.error("Error fetching access:", error);
      }
    };
    access();
  }, []);
  const [messages, setMessages] = useState([]);
  const [newsearch, setnewsearch] = useState(false);
  const [group, setGroup] = useState(null);
  const [refresh, setrefresh] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {});

  useEffect(() => {
    if (readyState) {
      sendJsonMessage({ type: "LOGIN", _id: sessionStorage["userId"] });
    }
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessages([...messages, lastMessage.data]);
      dispatch({ type: "SETBC", payload: messages });
    }
  }, [lastMessage]);

  const setconversationbyId = (e) => {
    setGroup(e);
  };

  const setRefresh = (e) => {
    setrefresh(true);
  };

  const logout = () => {
    sessionStorage["userId"] = "";
    sessionStorage["name"] = "";
    sessionStorage["accessToken"] = "";
    navigate("/");
  };

  return (
    <>
      <Card className="main-card">
        <Card className="px-1">
          <Dropdown>
            <Dropdown.Toggle className="no-arrow-dropdown">
              <ThreeDots size={20} color="black" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setnewsearch(true)}>
                New Group
              </Dropdown.Item>

              <Dropdown.Item>
                Settings
                <Gear className="ms-1" size={18} />
              </Dropdown.Item>
              <Dropdown.Item onClick={logout}>
                Logout
                <BoxArrowRight className="ms-1" size={18} />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card>
        <Card className="flex-row">
          <AllConversations
            getconversation={setconversationbyId}
            refreshconversations={refresh}
          />
          <Conversation
            conversation={group}
            refreshconversations={setRefresh}
          />
        </Card>
        {newsearch && <NewConversation closecomp={() => setnewsearch(false)} />}
      </Card>
    </>
  );
};

export default Main;
