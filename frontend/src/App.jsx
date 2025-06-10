import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import OrderTracking from "./components/OrderTracking/OrderTracking.jsx";
import ProductRegistration from "./components/Product/ProductRegistration.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/details/:id" element={<Detalhes />} />
        <Route path="/about" element={<About />} />
        <Route path="/fornecedor/:id" element={<SellerProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/rastreamento" element={<OrderTracking />} />
        <Route path="/vendedor" element={<BuyerProfile />} />
        <Route path="/produtos/novo" element={<ProductRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;