import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SeatContent from "./components/SeatContent";
import { CaptionCircle, CaptionContainer, CaptionItem, FooterContainer, FormContainer, PageContainer, SeatsContainer } from "./styled";

export default function SeatsPage({ selectedSeats, setSelectedSeats, clientName, setClientName, clientCPF, setClientCPF }) {
    const navigate = useNavigate();
    const { idFilme } = useParams();
    const [movieSeats, setMovieSeats] = useState(null);

    useEffect(() => {
        const url = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idFilme}/seats`;
        const promise = axios.get(url);
        promise.then((answer) => setMovieSeats(answer.data));
        promise.catch((error) => console.log(error.response.data));
        setClientName('');
        setClientCPF('');
    }, []);

    if (movieSeats === null) {
        return <PageContainer>Carregando...</PageContainer>
    }

    function selectSeat(seatNumber, availability) {
        if (availability) {
            const seatsAddedArr = [...selectedSeats, seatNumber];
            const seatsRemovedArr = [...selectedSeats].filter((s) => s !== seatNumber);
            if (!selectedSeats.includes(seatNumber)) {
                setSelectedSeats(seatsAddedArr);
            } else {
                setSelectedSeats(seatsRemovedArr);
            }
        }
    }

    return (
        <PageContainer>
            Selecione o(s) assento(s)
            <SeatsContainer>
                {movieSeats.seats.map((seat) => <SeatContent
                    key={seat.name}
                    seatId={seat.id}
                    seatNumber={seat.name}
                    availability={seat.isAvailable}
                    selectedSeats={selectedSeats}
                    selectSeat={selectSeat}
                    setSelectedSeats={setSelectedSeats} />)}
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle option={'selected'} />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle option={'available'} />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle option={'unavailable'} />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer onSubmit={(event) => handleSubmit(clientCPF, clientName, selectedSeats, navigate, event)}>
                <label htmlFor='name'>Nome do Comprador:</label>
                <input
                    id='name'
                    placeholder="Digite seu nome..."
                    data-test="client-name"
                    onChange={(e) => setClientName(e.target.value)}
                    value={clientName}
                    required />

                <label htmlFor='cpf'>CPF do Comprador:</label>
                <input
                    id='cpf'
                    placeholder="Digite seu CPF..."
                    data-test="client-cpf"
                    onChange={(e) => setClientCPF(e.target.value)}
                    value={clientCPF}
                    required />

                <button data-test="book-seat-btn" type='submit'>
                    Reservar Assento(s)
                </button>
            </FormContainer>

            <FooterContainer data-test="footer">
                <div>
                    <img src={movieSeats.movie.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{movieSeats.movie.title}</p>
                    <p>{movieSeats.day.weekday} - {movieSeats.name}</p>
                </div>
            </FooterContainer>
        </PageContainer>
    );
}

function validateCPF(clientCPF) {
    const formatedCPF = clientCPF.replace(/\D+/gi, '');
    const cpfLength = formatedCPF.length !== 11;
    if (cpfLength) {
        return false;
    }
    return true;
}

function handleSubmit(clientCPF, clientName, selectedSeats, navigate, event) {
    event.preventDefault();
    const isCPFValid = validateCPF(clientCPF);
    const areThereSeatsSelected = selectedSeats.length !== 0;

    if (isCPFValid && clientName && areThereSeatsSelected) {
        const body = { ids: selectedSeats, name: clientName, cpf: clientCPF };
        const url = 'https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many';
        const promise = axios.post(url, body)
        promise.then(() => {
            navigate('/sucesso');
        })
        promise.catch((error) => console.log(error));
    }
}