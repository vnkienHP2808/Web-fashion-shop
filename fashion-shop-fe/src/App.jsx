import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "boxicons/css/boxicons.min.css";
import HomePage from "./page/homePage";
import LogInPage from "./page/logInPage";
import SignUpPage from "./page/signUpPage";

function App() {
  return (
    // route của các trang
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/sign-in" element={<LogInPage/>} /> 
      <Route path="/sign-up" element={<SignUpPage/>} />
    </Routes>
  );
}

export default App;
