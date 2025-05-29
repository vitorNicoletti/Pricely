import "./App.css";
import Login from "./components/Login/Login.jsx";
import Catalogo from "./components/Catalog/Catalog.jsx";
import Payment from "./components/Payment/Payment.jsx";
import Detalhes from "./components/Detalhes/Detalhes.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
      />
      <Router>
        <Routes>
          <Route path="/" element={<Catalogo />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/payment" element={<Payment />}></Route>
          <Route path="/details/:id" element={<Detalhes />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
