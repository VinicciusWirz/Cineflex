import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SeatContent from "./components/SeatContent";
import loading from "../../assets/loading.svg";
import { CaptionCircle, CaptionContainer, CaptionItem, FooterContainer, FormContainer, PageContainer, SeatsContainer } from "./styled";

export default function SeatsPage(props) {
    const navigate = useNavigate();
    const { idFilme } = useParams();
    const [movieSeats, setMovieSeats] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [clientName, setClientName] = useState('');
    const [clientCPF, setClientCPF] = useState('');
    const [seatsNames, setSeatsNames] = useState([]);

    useEffect(() => {
        const url = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idFilme}/seats`;
        setClientName('');
        setClientCPF('');
        setSelectedSeats([]);
        setSeatsNames([]);
        props.setOrderInfo({
            movie: '',
            time: '',
            date: '',
            clientInfo: {
                name: '',
                cpf: '',
                seats: []
            }
        });
        const promise = axios.get(url);
        promise.then(({ data }) => {
            setMovieSeats(data);
            props.setOrderInfo({
                movie: data.movie.title,
                time: data.name,
                date: data.day.date,
                clientInfo: {
                    name: '',
                    cpf: '',
                    seats: []
                }
            });
        });
        promise.catch((error) => console.log(error.response.data));
    }, []);

    if (movieSeats === null) {
        return <PageContainer><img src={loading} /></PageContainer>;
    }

    function selectSeat(seatId, seatNumber, availability) {
        const selectedSeatsArr = selectedSeats;
        const seatsNamesArr = seatsNames;
        if (availability) {
            const seatsAddedArr = [...selectedSeatsArr, seatId];
            const seatsRemovedArr = [...selectedSeatsArr].filter((s) => s !== seatId);
            const seatsNumbersAddedArr = [...seatsNamesArr, seatNumber];
            const seatsNumbersRemovedArr = [...seatsNamesArr].filter((s) => s !== seatNumber);
            if (!selectedSeatsArr.includes(seatId)) {
                setSelectedSeats(seatsAddedArr);
                setSeatsNames(seatsNumbersAddedArr.sort((a, b) => parseInt(a) - parseInt(b)));
            } else {
                setSelectedSeats(seatsRemovedArr);
                setSeatsNames(seatsNumbersRemovedArr.sort((a, b) => parseInt(a) - parseInt(b)));
            }
        } else {
            alert('Assento indisponivel, por favor selecione outro');
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

            <FormContainer onSubmit={(event) => handleSubmit(
                clientCPF,
                clientName,
                selectedSeats,
                navigate,
                event,
                props.setOrderInfo,
                props.orderInfo,
                seatsNames)}
            >
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

function handleSubmit(clientCPF, clientName, selectedSeats, navigate, event, setOrderInfo, orderInfo, seatsNames) {
    event.preventDefault();
    const isCPFValid = clientCPF.replace(/\D+/gi, '').length === 11;
    const areThereSeatsSelected = selectedSeats.length !== 0;
    if (isCPFValid && clientName && areThereSeatsSelected) {
        const newOrder = { ...orderInfo };
        newOrder.clientInfo = { name: clientName, cpf: clientCPF, seats: seatsNames };
        setOrderInfo(newOrder);
        const body = { ids: selectedSeats, name: clientName, cpf: clientCPF };
        const url = 'https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many';
        const promise = axios.post(url, body);
        promise.then(() => {
            navigate('/sucesso');
        });
        promise.catch((error) => console.log(error.response.data));
    }
}