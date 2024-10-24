import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CategoryProducts from "./components/products/CategoryProducts";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import ProfileForm from "./components/ProfileForm";
import AboutUs from "./components/AboutUs";
import NotFound from "./components/NotFound";
import AirpodsProduct from "./components/products/AirpodsProduct";
import WatchProduct from "./components/products/WatchProduct";
import IpadProduct from "./components/products/IpadProduct";
import IphoneProduct from "./components/products/IphoneProduct";
import MacsProduct from "./components/products/MacsProduct";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/airpods" element={<CategoryProducts category="airpods" />} />
            <Route path="/watches" element={<CategoryProducts category="watches" />} />
            <Route path="/ipads" element={<CategoryProducts category="ipads" />} />
            <Route path="/iphones" element={<CategoryProducts category="iphones" />} />
            <Route path="/macs" element={<CategoryProducts category="macs" />} />
            <Route path="/airpods/:id" element={<AirpodsProduct />} />
            <Route path="/watches/:id" element={<WatchProduct />} />
            <Route path="/ipads/:id" element={<IpadProduct />} />
            <Route path="/iphones/:id" element={<IphoneProduct />} />
            <Route path="/macs/:id" element={<MacsProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProfileForm />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
