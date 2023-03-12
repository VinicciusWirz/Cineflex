import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import arrow from "../assets/arrow.png";

export default function NavBar() {
    const navigate = useNavigate();
    return (
        <NavContainer>
            <img src={arrow} data-test="go-home-header-btn" onClick={() => navigate(-1)} />
            <Link to="/" >
                CINEFLEX
            </Link>
        </NavContainer>
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
    img{
        position: absolute;
        left: 18px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }
`;