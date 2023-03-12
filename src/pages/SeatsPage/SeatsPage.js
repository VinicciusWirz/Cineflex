import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SeatContent from "./components/SeatContent";
import loading from "../../assets/loading.svg";
import NavBar from "../../components/NavBar";
import { CaptionCircle, CaptionContainer, CaptionItem, FooterContainer, FormContainer, PageContainer, SeatsContainer } from "./styled";

export default function SeatsPage(props) {
    const navigate = useNavigate();
    const { idFilme } = useParams();
    const [movieSeats, setMovieSeats] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatsNames, setSeatsNames] = useState([]);
    const [buyers, setBuyers] = useState([]);
    useEffect(() => {
        const url = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${idFilme}/seats`;
        setSelectedSeats([]);
        setSeatsNames([]);
        setBuyers([]);
        props.setOrderInfo({
            movie: '',
            time: '',
            date: '',
            clientInfo: {
                clients: [],
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
                    clients: [],
                    seats: []
                }
            });
        });
        promise.catch((error) => alert(error.response.data));
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
                const seatsNumbersAddedArrOrganized = seatsNumbersAddedArr.sort((a, b) => parseInt(a) - parseInt(b));
                const buyersOrganized = [...buyers, { id: seatId, name: '', cpf: '', number: seatNumber }].sort((a, b) => parseInt(a) - parseInt(b));
                setSelectedSeats(seatsAddedArr);
                setSeatsNames(seatsNumbersAddedArrOrganized);
                setBuyers(buyersOrganized);
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

    function handleInputsChanges(event) {
        const updateInputs = [...buyers];
        const seatN = event.target.id.replace(/\D+/gi, '');
        const updatedInputsFiltered = updateInputs.find((e) => e.number === seatN);
        updatedInputsFiltered[event.target.name] = event.target.value;
        if (event.target.name === 'cpf') {
            updatedInputsFiltered[event.target.name] = event.target.value.replace(/\D+/gi, '');
        }
        setBuyers(updateInputs);
    }

    return (
        <>
            <NavBar />

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
                    setMovieSeats,
                    buyers,
                    selectedSeats,
                    navigate,
                    event,
                    props.setOrderInfo,
                    props.orderInfo)}
                >
                    {seatsNames.length > 0 && seatsNames.map((buyerSeat) =>
                        <div key={buyerSeat}>
                            <label htmlFor={`name${buyerSeat}`} >{`Nome do Comprador ${buyerSeat}:`}</label>
                            <input
                                id={`name${buyerSeat}`}
                                placeholder="Digite seu nome..."
                                data-test="client-name"
                                name={'name'}
                                onChange={(e) => handleInputsChanges(e)}
                                value={buyers.find((e) => e.number === buyerSeat).name}
                                required />

                            <label htmlFor={`cpf${buyerSeat}`}>{`CPF do Comprador ${buyerSeat}:`}</label>
                            <input
                                id={`cpf${buyerSeat}`}
                                placeholder="Digite seu CPF..."
                                data-test="client-cpf"
                                name={'cpf'}
                                onChange={(e) => handleInputsChanges(e)}
                                value={buyers.find((e) => e.number === buyerSeat).cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}
                                required
                                minLength={11}
                                maxLength={14}
                            />
                        </div>)
                    }

                    <button data-test="book-seat-btn" type='submit' disabled={seatsNames.length === 0}>
                        {seatsNames.length === 0 ? 'Selecione o(s) assento(s) primeiro' : 'Reservar Assento(s)'}
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

function handleSubmit(setMovieSeats, buyers, selectedSeats, navigate, event, setOrderInfo, orderInfo) {
    event.preventDefault();
    const buyersAmount = buyers.length;
    const newOrder = { ...orderInfo };
    const compradores = buyers.map((c) => ({ idAssento: c.id, nome: c.name, cpf: c.cpf.replace(/\D+/gi, '') }));
    const seatsNumbers = getNumbers(buyers);
    newOrder.clientInfo = { clients: buyers, seats: seatsNumbers };
    let body = {};
    if (buyersAmount > 1) {
        body = { ids: selectedSeats, compradores };
    }
    if (buyersAmount === 1) {
        body = { ids: selectedSeats, name: compradores[0].nome, cpf: compradores[0].cpf };
    }
    if (buyersAmount >= 1) {
        setMovieSeats(null);
        setOrderInfo(newOrder);
        const url = 'https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many';
        const promise = axios.post(url, body);
        promise.then(() => {
            navigate('/sucesso');
        });
        promise.catch((error) => alert(error.response.data));
    }
}

function getNumbers(buyers) {
    const seatNumbersArray = [];
    buyers.forEach((b) => seatNumbersArray.push(b.number));
    return seatNumbersArray;
}