import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home1copy";
import Login from "../pages/login/Login";
import Register from "../pages/Cadastrar/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Menu from "../pages/menu/Menu";

function Rotas() {
    return(
        <div>
            
            <Router>
               
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/cadastrar" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/menu" element={<Menu />} />
                    </Routes>

            </Router>
        </div>
    )
}

export default Rotas;