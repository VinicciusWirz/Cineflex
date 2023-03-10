import { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import HomePage from "./pages/HomePage/HomePage";
import SeatsPage from "./pages/SeatsPage/SeatsPage";
import SessionsPage from "./pages/SessionsPage/SessionsPage";
import SuccessPage from "./pages/SuccessPage/SuccessPage";

export default function App() {
    const [orderInfo, setOrderInfo] = useState({ movie: '', time: '', date: '', clientInfo: { name: '', cpf: '', seats: [] } });

    function clearAll() {
        setOrderInfo({ movie: '', time: '', date: '', clientInfo: { name: '', cpf: '', seats: [] } });
    }

    return (
        <BrowserRouter>
            <NavContainer>
                <Link to="/" onClick={clearAll}>
                    CINEFLEX
                </Link>
            </NavContainer>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sessoes/:idFilme" element={<SessionsPage />} />
                <Route path="/assentos/:idFilme" element={<SeatsPage setOrderInfo={setOrderInfo} orderInfo={orderInfo} />} />
                <Route path="/sucesso" element={<SuccessPage orderInfo={orderInfo} clearAll={clearAll} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

const NavContainer = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #C3CFD9;
    color: #E8833A;
    font-family: 'Roboto', sans-serif;
    font-size: 34px;
    position: fixed;
    top: 0;
    a {
        text-decoration: none;
        color: #E8833A;
    }
`;
