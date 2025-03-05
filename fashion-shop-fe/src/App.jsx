import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "boxicons/css/boxicons.min.css";
import HomePage from "./page/homePage";
import LogIn from "./page/logInPage";

function App() {
  return (
    // route của các trang
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<LogIn/>} /> 
    </Routes>
  );
}

export default App;
