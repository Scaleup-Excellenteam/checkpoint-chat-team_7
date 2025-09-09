import { useState } from "react";
import { Button, Card, Container, Form, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [alert, setalert] = useState("");

  const registerUrl = import.meta.env.VITE_API_BACKEND_URL + "auth/register";

  const navigate = useNavigate();

  const createuser = async (e) => {
    e.preventDefault();
    setisLoading(true);
    try {
      const newUser = {
        fullname: name.toLowerCase(),
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: password,
      };
      const sendData = await axios.post(registerUrl, newUser);
      if (sendData.status !== 200) {
        setalert("Username already exists");
        return;
      }
      navigate("/", { state: { from: "signup" } });
    } catch (err) {
      console.log(err.message);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      <Card className="signuplogin-card">
        <Card className="signuplogin-subcard">
          <Container>
            <Card.Text className="h3">Sign Up</Card.Text>
            <Form onSubmit={createuser}>
              <Row className="mt-3">
                <input
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setname(e.target.value)}
                  required
                />
              </Row>
              <Row className="mt-3">
                <input
                  type="text"
                  placeholder="User name"
                  onChange={(e) => setusername(e.target.value)}
                  required
                />
              </Row>
              <Row className="mt-3">
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setemail(e.target.value)}
                  required
                />
              </Row>
              <Row className="mt-3">
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setpassword(e.target.value)}
                  required
                />
              </Row>
              {alert && (
                <Row className="mt-3">
                  <Card.Text className="text-danger">{alert}</Card.Text>
                </Row>
              )}
              <Row className="mt-4 mb-2">
                {isLoading ? (
                  <Button disabled>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Creating account...
                  </Button>
                ) : (
                  <Button type="submit">Create</Button>
                )}
              </Row>
              <Card.Text className="text-center">
                Already have an account? &nbsp;
                <Card.Link className="link" onClick={() => navigate("/")}>
                  Login
                </Card.Link>
              </Card.Text>
            </Form>
          </Container>
        </Card>
      </Card>
    </>
  );
};

export default Create;
