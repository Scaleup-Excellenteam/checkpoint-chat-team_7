import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Create from "./pages/Create";
import Main from "./pages/Main";

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
