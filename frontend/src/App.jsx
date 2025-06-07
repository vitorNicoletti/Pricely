import "./App.css";
import Cart from "./components/Cart/Cart.jsx";
import About from "./components/About/About.jsx";
import Login from "./components/Login/Login.jsx";
import Payment from "./components/Payment/Payment.jsx";
import Catalogo from "./components/Catalog/Catalog.jsx";
import Cadastro from "./components/Cadastro/Cadastro.jsx";
import Detalhes from "./components/Detalhes/Detalhes.jsx";
import SellerProfile from "./components/SellerProfile/SellerProfile.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderTracking from "./components/OrderTracking/OrderTracking.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        Projeto Limpo
      </div>
    </>
  )
}

export default App;
