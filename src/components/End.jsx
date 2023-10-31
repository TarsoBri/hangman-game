import './End.css';

const End = ({ retry, score }) => {
    return (
        <div>
            <h1>Game Over!</h1>
            <h2>
                A sua pontuação foi: <span> {score} </span>
            </h2>
            <button onClick={retry}>Jogar de novo!</button>
        </div>
    );
};

export default End;
