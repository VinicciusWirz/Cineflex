import styled from "styled-components";

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`;

export const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`;

export const FormContainer = styled.form`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    div{
        display:flex;
        flex-wrap: wrap;
    }
    button, a {
        align-self: center;
        text-decoration: none;
    }
    input {
        width: calc(100vw - 60px);
    }
`;

export const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`;

export const CaptionCircle = styled.div`
    border: 1px solid ${(props) => props.option === 'selected' ? '#0E7D71' : props.option === 'available' ? '#808F9D' : '#F7C52B'};         // Essa cor deve mudar
    background-color: ${(props) => props.option === 'selected' ? '#1AAE9E' : props.option === 'available' ? '#C3CFD9' : '#FBE192'};    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`;

export const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`;
export const SeatItem = styled.div`
    border: 1px solid ${(props) => props.option === 'selected' ? '#0E7D71' : props.option === 'available' ? '#808F9D' : '#F7C52B'};         // Essa cor deve mudar
    background-color: ${(props) => props.option === 'selected' ? '#1AAE9E' : props.option === 'available' ? '#C3CFD9' : '#FBE192'}; 
    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`;

export const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`;