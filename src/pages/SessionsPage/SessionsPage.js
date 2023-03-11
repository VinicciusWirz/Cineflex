import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageContainer, ButtonsContainer, SessionContainer, FooterContainer } from "./styled";
import loading from "../../assets/loading.svg";
import NavBar from "../../components/NavBar";

export default function SessionsPage({ clearAll }) {
    const { idFilme } = useParams();
    const [movieTimes, setMovieTimes] = useState(null);

    useEffect(() => {
        const url = `https://mock-api.driven.com.br/api/v8/cineflex/movies/${idFilme}/showtimes`;
        const promise = axios.get(url);
        promise.then((answer) => setMovieTimes(answer.data));
        promise.catch((error) => alert(error.response.data))
    }, []);

    if (movieTimes === null) {
        return <PageContainer><img src={loading} /></PageContainer>
    }

    function TimeButtons(props) {
        return (
            <ButtonsContainer>
                {props.times.map((times) => (
                    <Link to={`/assentos/${times.id}`} key={times.id} data-test="showtime">
                        <button>{times.name}</button>
                    </Link>
                ))}
            </ButtonsContainer>
        );
    }

    return (
        <>
            <NavBar clearAll={clearAll} />
            <PageContainer>
                Selecione o horário
                <div>
                    {movieTimes.days.map((day) =>
                        <SessionContainer key={day.id} data-test="movie-day">
                            {day.weekday} - {day.date}
                            <TimeButtons times={day.showtimes} />
                        </SessionContainer>)
                    }
                </div>

                <FooterContainer data-test="footer">
                    <div>
                        <img src={movieTimes.posterURL} alt="poster" />
                    </div>
                    <div>
                        <p>{movieTimes.title}</p>
                    </div>
                </FooterContainer>

            </PageContainer>
        </>
    );
}
