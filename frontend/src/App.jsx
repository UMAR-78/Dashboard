import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar/navbar";
import Menu from "./components/menu/menu";
import Homepage from "./pages/homepage/homepage";
import Footer from "./components/footer/footer";
import UploadRevenueFilePage from './pages/revenuePage/uploadRevenueFilePage';
import RevenueStats from './pages/revenuePage/revenueStats'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <Router>
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menu-container">
            <Menu />
          </div>
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/upload-revenue-file" element={<UploadRevenueFilePage />} />
              <Route path="/revenue-stats" element={<RevenueStats />} />

            </Routes>
          </div>
        </div>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
