import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Airpods from "./components/products/Airpods";
import Watches from "./components/products/Watches";
import Ipads from "./components/products/Ipads";
import Iphones from "./components/products/Iphones";
import Macs from "./components/products/Macs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";
import AirpodsProduct from "./components/products/AirpodsProduct";
import IpadProduct from "./components/products/IpadProduct";
import WatchProduct from "./components/products/WatchProduct";
import IphoneProduct from "./components/products/IphoneProduct";
import MacsProduct from "./components/products/MacsProduct";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import ProfileForm from "./components/ProfileForm";
import AboutUs from "./components/AboutUs";
import NotFound from "./components/NotFound";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/airpods" element={<Airpods />} />
            <Route path="/airpods/:id" element={<AirpodsProduct />} />
            <Route path="/watches" element={<Watches />} />
            <Route path="/watches/:id" element={<WatchProduct />} />
            <Route path="/ipads" element={<Ipads />} />
            <Route path="/ipads/:id" element={<IpadProduct />} />
            <Route path="/iphones" element={<Iphones />} />
            <Route path="/iphones/:id" element={<IphoneProduct />} />
            <Route path="/macs" element={<Macs />} />
            <Route path="/macs/:id" element={<MacsProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfileForm />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
