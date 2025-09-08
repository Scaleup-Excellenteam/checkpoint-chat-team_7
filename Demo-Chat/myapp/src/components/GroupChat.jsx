import { Card, Form, Button, InputGroup, Alert } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import axios from "axios";

const GroupChat = ({ selectedGroup, userName }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const WS_URL = "ws://localhost:3000";

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      // Send login message when connected
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        sendJsonMessage({ type: "LOGIN", _id: userId });
      }
    },
    onClose: () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    },
  });

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle incoming messages
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (
          data.type === "group_message" &&
          data.groupId === selectedGroup?._id
        ) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              text: data.msg,
              sender: data.sender || data.name, // Use username if available, fallback to full name
              timestamp: new Date(data.ts),
            },
          ]);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    }
  }, [lastMessage, selectedGroup]);

  // Load existing messages when group changes
  useEffect(() => {
    if (selectedGroup) {
      setMessages(selectedGroup.messages || []);
    }
  }, [selectedGroup]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedGroup) return;

    // Send via WebSocket only - the server will handle saving and broadcasting
    sendJsonMessage({
      type: "group_message",
      groupId: selectedGroup._id,
      message: message.trim(),
      from: sessionStorage.getItem("userId"),
    });

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedGroup) {
    return (
      <Card className="h-100">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <h5>Select a group to start chatting</h5>
            <p>
              Choose a group from the list to view messages and send new ones
            </p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100 d-flex flex-column">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">{selectedGroup.groupName || "Unnamed Group"}</h5>
          <small className="text-muted">
            {selectedGroup.members ? selectedGroup.members.length : 0} members
          </small>
        </div>
        <div className="d-flex align-items-center">
          <div
            className={`me-2 ${isConnected ? "text-success" : "text-danger"}`}
            style={{ fontSize: "12px" }}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>
      </Card.Header>

      <Card.Body className="flex-grow-1 p-0" style={{ overflowY: "auto" }}>
        <div className="p-3" style={{ minHeight: "400px" }}>
          {messages.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <p>No messages in this group yet</p>
              <p>Be the first to send a message!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={msg.id || index} className="mb-3">
                <div
                  className={`d-flex ${
                    msg.sender === sessionStorage.getItem("userName")
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded ${
                      msg.sender === sessionStorage.getItem("userName")
                        ? "bg-primary text-white"
                        : "bg-light"
                    }`}
                    style={{ maxWidth: "70%" }}
                  >
                    <div className="fw-bold small">
                      {msg.sender === sessionStorage.getItem("userName")
                        ? "You"
                        : msg.sender}
                    </div>
                    <div>{msg.text}</div>
                    <div className="small opacity-75">
                      {new Date(msg.timestamp).toLocaleTimeString("he-IL")}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card.Body>

      <Card.Footer>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={!message.trim() || !isConnected}
          >
            Send
          </Button>
        </InputGroup>
        {!isConnected && (
          <Alert variant="warning" className="mt-2 mb-0 py-2">
            <small>No connection to server. Please refresh the page.</small>
          </Alert>
        )}
      </Card.Footer>
    </Card>
  );
};

export default GroupChat;
