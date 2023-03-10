import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SeatContent from "./components/SeatContent";
import loading from "../../assets/loading.svg";
import arrow from "../../assets/arrow.png";
import NavBar from "../../components/NavBar";
import { CaptionCircle, CaptionContainer, CaptionItem, FooterContainer, FormContainer, PageContainer, SeatsContainer } from "./styled";

export default function SeatsPage(props) {
    const navigate = useNavigate();
    const { idFilme } = useParams();
    const [movieSeats, setMovieSeats] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatsNames, setSeatsNames] = useState([]);
    const [movieId, setMovieId] = useState(0);
    const [buyers, setBuyers] = useState([]);
    useEffect(() => {
        const url = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idFilme}/seats`;
        setSelectedSeats([]);
        setSeatsNames([]);
        props.setOrderInfo({
            movie: '',
            time: '',
            date: '',
            clientInfo: {
                clients: [],
                seats: []
            }
        });
        setBuyers([]);
        const promise = axios.get(url);
        promise.then(({ data }) => {
            setMovieSeats(data);
            props.setOrderInfo({
                movie: data.movie.title,
                time: data.name,
                date: data.day.date,
                clientInfo: {
                    clients: [],
                    seats: []
                }
            });
            setMovieId(data.movie.id);
            setBuyers([]);
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
                setBuyers([...buyers, { id: seatId, nome: '', cpf: '' }].sort((a, b) => parseInt(a) - parseInt(b)));
            } else {
                const deletionConfirmation = `Você deseja desselecionar o assento ${seatNumber}?`;
                if (window.confirm(deletionConfirmation) === true) {
                    setSelectedSeats(seatsRemovedArr);
                    setSeatsNames(seatsNumbersRemovedArr.sort((a, b) => parseInt(a) - parseInt(b)));
                    setBuyers(buyers.filter((e) => e.id !== seatId));
                }
            }
        } else {
            alert('Assento indisponivel, por favor selecione outro');
        }
    }

    function handleInputsChanges(event, index, type) {
        const updateInputs = [...buyers];
        if (type === 'nome') {
            updateInputs[index].nome = event;
            setBuyers(updateInputs);
        }
        if (type === 'cpf') {
            updateInputs[index].cpf = event;
            setBuyers(updateInputs);
        }
    }

    return (
        <>
            <NavBar clearAll={props.clearAll} link={`/sessoes/${movieId}`} >
                <img src={arrow} />
            </NavBar>

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
                    buyers,
                    selectedSeats,
                    navigate,
                    event,
                    props.setOrderInfo,
                    props.orderInfo,
                    seatsNames)}
                >
                    {seatsNames.length > 0 ? seatsNames.map((buyerSeat, i) =>
                        <div key={buyerSeat}>
                            <label htmlFor={`name${i}`} >{`Nome do Comprador ${buyerSeat}:`}</label>
                            <input
                                id={`name${i}`}
                                placeholder="Digite seu nome..."
                                data-test="client-name"
                                onChange={(e) => handleInputsChanges(e.target.value, i, 'nome')}
                                value={buyers[i].nome}
                                required />

                            <label htmlFor={`cpf${i}`}>{`CPF do Comprador ${buyerSeat}:`}</label>
                            <input
                                id={`cpf${i}`}
                                placeholder="Digite seu CPF..."
                                data-test="client-cpf"
                                onChange={(e) => handleInputsChanges(e.target.value, i, 'cpf')}
                                value={buyers[i].cpf}
                                required />
                        </div>
                    ) :
                        <div>
                            <label htmlFor='name' >Nome do Comprador:</label>
                            <input
                                id='name'
                                placeholder="Digite seu nome..."
                                data-test="client-name"
                                value=""
                                disabled
                                required />

                            <label htmlFor='cpf'>CPF do Comprador:</label>
                            <input
                                id='cpf'
                                placeholder="Digite seu CPF..."
                                data-test="client-cpf"
                                disabled
                                required />
                        </div>}

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
        </>
    );
}

function handleSubmit(buyers, selectedSeats, navigate, event, setOrderInfo, orderInfo, seatsNames) {
    event.preventDefault();
    const isCPFValid = cpfValidation(buyers);
    const howManyBuyers = buyers.length;
    const newOrder = { ...orderInfo };
    newOrder.clientInfo = { clients: buyers, seats: seatsNames };
    if (isCPFValid && howManyBuyers > 1) {
        setOrderInfo(newOrder);
        const body = { ids: selectedSeats, buyers };
        const url = 'https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many';
        const promise = axios.post(url, body);
        promise.then(() => {
            navigate('/sucesso');
        });
        promise.catch((error) => console.log(error.response.data));
    }
    if (isCPFValid && howManyBuyers === 1) {
        setOrderInfo(newOrder);
        const body = { ids: selectedSeats, name: buyers[0].nome, cpf: buyers[0].cpf };
        const url = 'https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many';
        const promise = axios.post(url, body);
        promise.then(() => {
            navigate('/sucesso');
        });
        promise.catch((error) => console.log(error.response.data));
    }
}

function cpfValidation(buyers) {
    let aux = 0;
    buyers.forEach((b) => b.cpf.replace(/\D+/gi, '').length === 11 && aux++);
    return aux === buyers.length;
}