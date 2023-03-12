import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import loading from "../../assets/loading.svg";

export default function HomePage() {
    const [moviesList, setMoviesList] = useState(null);

    useEffect(() => {
        const url = "https://mock-api.driven.com.br/api/v8/cineflex/movies";
        const promise = axios.get(url);
        promise.then((answer) => setMoviesList(answer.data));
        promise.catch((error) => alert(error.response.data));
    }, []);

    if (moviesList === null) {
        return <PageContainer><img src={loading} /></PageContainer>;
    }

    if (moviesList === 'Not Found') {
        return <PageContainer>{moviesList}</PageContainer>;
    }

    return (
        <PageContainer>
            Selecione o filme

            <ListContainer>
                {moviesList.map((movie) => (
                    <MovieContainer key={movie.id} data-test="movie">
                        <Link to={`/sessoes/${movie.id}`}>
                            <img src={movie.posterURL} alt="poster" />
                        </Link>
                    </MovieContainer>
                ))}
            </ListContainer>

        </PageContainer>
    );
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-top: 70px;
`;
const ListContainer = styled.div`
    width: 330px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    padding: 10px;
`;
const MovieContainer = styled.div`
    width: 145px;
    height: 210px;
    box-shadow: 0px 2px 4px 2px #0000001A;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px;
    img {
        width: 130px;
        height: 190px;
    }
`;