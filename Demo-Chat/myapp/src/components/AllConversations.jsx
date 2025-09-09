import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { serverURL } from "../constants/APIs";

import ConversationDetails from "./ConversationDetails";

const AllConversations = ({ getconversation, refreshconversation }) => {
  const server = serverURL;

  const [allconversations, setallconversations] = useState([]);
  const [activechat, setactivechat] = useState("");
  // const [allconv, setallconv] = useState(true);
  const [forSearch, setforSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${server}conversations`);
      setallconversations(data);
    };
    fetchData();
  }, [refreshconversation]);

  const filterdConversations = useMemo(
    () =>
      allconversations.filter((conv) => {
        return conv.groupName
          .toLocaleLowerCase()
          .includes(forSearch.toLocaleLowerCase());
      }),
    [forSearch]
  );

  const sendid = (e) => {
    getconversation(e);
    // setactivechat(e.with);
  };

  return (
    <>
      <div className="allconversations">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search conversations..."
            onChange={(e) => setforSearch(e.target.value)}
          />
        </div>
        <div className="conversation-list">
          {!forSearch &&
            allconversations?.map((con, index) => {
              return (
                <ConversationDetails
                  con={con}
                  getconid={sendid}
                  key={index}
                  activeconv={activechat}
                />
              );
            })}
          {forSearch &&
            filterdConversations?.map((con, index) => {
              return (
                <ConversationDetails
                  con={con}
                  getconid={sendid}
                  key={index}
                  activeconv={activechat}
                />
              );
            })}
          {(!allconversations || allconversations.length === 0) && (
            <div className="empty-state">
              <h6>No conversations yet</h6>
              <p>Start a new conversation to get started!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllConversations;
