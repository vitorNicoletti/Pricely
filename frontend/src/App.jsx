import "./App.css";
import Cart from "./components/Cart/Cart.jsx";
import About from "./components/About/About.jsx";
import Login from "./components/Login/Login.jsx";
import Payment from "./components/Payment/Payment.jsx";
import Catalogo from "./components/Catalog/Catalog.jsx";
import Cadastro from "./components/Cadastro/Cadastro.jsx";
import Detalhes from "./components/Detalhes/Detalhes.jsx";
import SellerProfile from "./components/SellerProfile/SellerProfile.jsx";
import BuyerProfile from "./components/BuyerProfile/BuyerProfile.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderTracking from "./components/OrderTracking/OrderTracking.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Catalogo />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/cadastro" element={<Cadastro />}></Route>
          <Route path="/payment" element={<Payment />}></Route>
          <Route path="/details/:id" element={<Detalhes />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/fornecedor/:id" element={<SellerProfile />}></Route>
          <Route path="/cart/" element={<Cart />}></Route>
          <Route path="/rastreamento" element={<OrderTracking />}></Route>
          <Route path="/vendedor/" element={<BuyerProfile />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;