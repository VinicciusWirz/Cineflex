import { Link } from "react-router-dom";
import styled from "styled-components";

export default function NavBar(props) {
    return (
        <NavContainer>
            <Link to={props.link} onClick={props.clearAll} data-test="go-home-header-btn">
                {props.children}
            </Link>
            <Link to="/" onClick={props.clearAll}>
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
        &:first-child{
            position: absolute;
            left: 18px;
            top: 20px;
        }
    }
`;