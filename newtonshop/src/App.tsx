import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Airpods from './components/products/Airpods';
import Watches from './components/products/Watches';
import Ipads from './components/products/Ipads';
import Iphones from './components/products/Iphones';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';
import AirpodsProduct from './components/products/AirpodsProduct';
import IpadProduct from './components/products/IpadProduct';
import WatchProduct from './components/products/WatchProduct';
import IphoneProduct from './components/products/IphoneProduct';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './components/HomePage';

const App: React.FC = () => {
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
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
