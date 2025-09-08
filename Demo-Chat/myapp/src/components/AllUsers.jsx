import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container, Form, Row } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import ChatAFriend from "../pages/ChatAFriend";

const AllUsers = () => {
  const navigate = useNavigate();
  const [allUsers, setallUsers] = useState([]);
  const [selectedID, setselectedID] = useState("");

  const usersurl = import.meta.env.VITE_API_BACKEND_URL + "users";
  const connected = import.meta.env.VITE_API_BACKEND_URL + "connected";

  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await axios.get(usersurl);
      setallUsers([...users]);
    };
    fetchData();
  }, []);

  const setdata = (e) => {
    setselectedID(e.target.value);
  };

  const handleChange = async () => {
    const user = allUsers.find((user) => user._id === selectedID);
    sessionStorage["id"] = selectedID;
    sessionStorage["name"] = user.name;
    navigate("/chatafriend");
  };

  return (
    <>
      <Card style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
        <Card.Body>
          <select onChange={setdata}>
            <option value="/"></option>
            {allUsers?.map((user) => {
              return (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              );
            })}
          </select>
          <br />
          <Button className="mt-2" onClick={handleChange}>
            chat
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default AllUsers;
