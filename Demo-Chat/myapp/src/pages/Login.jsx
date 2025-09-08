import { useState } from "react";
import { Card, Row, Container, Button, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [alert, setalert] = useState("");

  const auth = import.meta.env.VITE_API_BACKEND_URL + "auth/login";

  const navigate = useNavigate();

  const Loginn = async (e) => {
    e.preventDefault();
    setisLoading(true);
    try {
      const loginData = {
        username: username.toLowerCase(),
        password: password,
      };
      const resp = await axios.post(auth, loginData);

      if (resp.status !== 200) {
        setalert("User name or password is incorrect");
        return;
      }

      sessionStorage["userId"] = resp.data.id;
      sessionStorage["username"] = username.toLowerCase();
      sessionStorage["accessToken"] = resp.data.accessToken;
      navigate("/main");
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key == "Enter") {
      Loginn(e);
    }
  };

  return (
    <>
      <Card className="signuplogin-card">
        <Card className="signuplogin-subcard px-3 py-5">
          <Card.Text className="h3 text-center">Login</Card.Text>
          <Container>
            <Form onKeyDown={handleKeyPress} onSubmit={Loginn}>
              <Row className="mt-4">
                <input
                  type="text"
                  placeholder="User name"
                  onChange={(e) => setusername(e.target.value)}
                  required
                />
              </Row>
              <Row className="mt-4">
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setpassword(e.target.value)}
                  required
                />
              </Row>
              {alert && (
                <Row className="mt-3">
                  <Card.Text className="text-danger text-center">
                    {alert}
                  </Card.Text>
                </Row>
              )}
              <Row className="mt-3 text-center">
                <Link className="link">Forgot password</Link>
              </Row>
              <Row className="mt-4 mb-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Row>
              <Card.Text className="text-center">
                Dont have an account?&nbsp;
                <Card.Link
                  className="link"
                  onClick={() => navigate("/createacc")}
                >
                  Signup
                </Card.Link>
              </Card.Text>
            </Form>
          </Container>
        </Card>
      </Card>
    </>
  );
};

export default Login;
