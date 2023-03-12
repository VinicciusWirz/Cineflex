import styled from "styled-components";
import { Link } from "react-router-dom";

export default function SuccessPage({ orderInfo }) {
    const decimal = 10;

    return (
        <PageContainer>
            <h1>Pedido feito <br /> com sucesso!</h1>

            <TextContainer data-test="movie-info">
                <strong><p>Filme e sessão</p></strong>
                <p>{orderInfo.movie}</p>
                <p>{orderInfo.date} - {orderInfo.time}</p>
            </TextContainer>

            <TextContainer data-test="seats-info">
                <strong><p>Ingressos</p></strong>
                {orderInfo.clientInfo.seats.map((seat) => <p key={seat}>Assento {Number(seat) < decimal ? `0${seat}` : seat}</p>)}
            </TextContainer>

            <TextContainer data-test="client-info">
                <strong><p>{orderInfo.clientInfo.clients.length > 1 ? 'Comprador(es)' : 'Comprador'}</p></strong>
                {orderInfo.clientInfo.clients.map((c) =>
                    <div key={c.id}>
                        <p>Nome: {c.name}</p>
                        <p>CPF: {c.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}</p>
                    </div>
                )}
            </TextContainer>

            <Link to="/" data-test="go-home-btn" >
                <button>
                    Voltar para Home
                </button>
            </Link>
        </PageContainer>
    );
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    color: #293845;
    margin: 30px 20px;
    padding-bottom: 120px;
    padding-top: 70px;
    a {
        text-decoration: none;
    }
    button {
        margin-top: 50px;
    }
    h1 {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 28px;
        display: flex;
        align-items: center;
        text-align: center;
        color: #247A6B;
    }
`;
const TextContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;
    strong {
        font-weight: bold;
        margin-bottom: 10px;
    }
`;