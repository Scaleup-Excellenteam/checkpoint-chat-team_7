import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Create from "./pages/Create";
import Main from "./pages/Main";
import "./CSS/Login.css";
import "./CSS/Create.css";
import "./CSS/Main.css";
import "./CSS/AllConversations.css";
import "./CSS/Conversation.css";
import "./CSS/Message.css";
import "./CSS/ConversationDetails.css";
import "./CSS/NewConversation.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createacc" element={<Create />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </>
  );
}

export default App;
