import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Card, Row } from "react-bootstrap";
import { Send } from "react-bootstrap-icons";

const SearchPeople = ({ chatWith, active }) => {
  const userURL = import.meta.env.VITE_API_BACKEND_URL + "users";

  const [forSearch, setforSearch] = useState("");
  const [user, setuser] = useState({});
  const [allusers, setallusers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(userURL);
      setallusers([...data]);
      const u = data.find((u) => u._id === sessionStorage["userId"]);
      setuser({ ...u });
    };
    fetchData();
  }, []);

  const filterdUsers = useMemo(
    () =>
      allusers.filter((user) => {
        return user.username
          .toLocaleLowerCase()
          .includes(forSearch.toLocaleLowerCase());
      }),
    [forSearch]
  );

  return (
    <>
      <Card.Text className="text-center mb-2">
        <input
          type="text"
          placeholder="Search for people"
          className="py-1"
          onChange={(e) => setforSearch(e.target.value)}
        />
      </Card.Text>
      {forSearch && (
        <Card className="searched">
          {filterdUsers?.map((user, index) => {
            return (
              user._id !== sessionStorage["userId"] && (
                <div key={index}>
                  <span style={{ float: "left" }}>{user.username}</span>
                  <Send
                    className="mt-1"
                    size={20}
                    style={{ float: "right" }}
                    cursor="pointer"
                    onClick={() => chatWith(user._id)}
                  />
                </div>
              )
            );
          })}
        </Card>
      )}
    </>
  );
};

export default SearchPeople;
