import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "boxicons/css/boxicons.min.css";
import HomePage from "./page/homePage";
import SignInPage from "./page/SignInPage";
import SignUpPage from "./page/SignUpPage";
import UserProfile from "./page/UserProfile";
import ChangePassword from "./page/ChangePage";

function App() {
  return (
    // route của các trang
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/sign-in" element={<SignInPage/>} /> 
      <Route path="/sign-up" element={<SignUpPage/>} />
      <Route path="/profile" element={<UserProfile/>} />
      <Route path="/change-password" element={<ChangePassword/>} />
    </Routes>
  );
}

export default App;
