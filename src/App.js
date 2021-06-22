import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';

function App() {

  const [boardsData, setBoardsData] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState({
    title: '',
    owner: '',
    board_id: null
  });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/boards`, {
    }).then((response) => {
      setBoardsData(response.data);
    })
  }, []);

  const selectBoard = (board) => { setSelectedBoard(board) };

  const boardsElements = boardsData.map((board) => {
    return (<section>
      <h3 onClick={() => { selectBoard(board) }}>{board.title} by {board.owner}</h3>
    </section>)
  });

  const submitNewBoard = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/boards`, {
      title, owner
    }).then((response) => {
      console.log("response datatst", response.data.board);
      const boards = [...boardsData];
      boards.push(response.data.board);
      setBoardsData(boards);
    }).catch((error) => {
      console.log("errororoorroor", error);
    });
  };

  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const handleTitleChange = (e) => { setTitle(e.target.value) };
  const handleOwnerChange = (e) => { setOwner(e.target.value) };

  return (
    <div>
      <h1>Inspiration Board</h1>
      <section>
        <h2>Boards</h2>
        {boardsElements}
      </section>
      <section>
        <h2>Create a New Board</h2>
        <form onSubmit={submitNewBoard}>
          <label>Title</label>
          <input type="text" onChange={handleTitleChange}></input>
          <label>Owner's Name</label>
          <input type="text" onChange={handleOwnerChange}></input>
          <input type="Submit"></input>
        </form>
        <p>Preview: {title} - {owner}</p>
      </section>
      {selectedBoard.board_id ? <CardsList board={selectedBoard}></CardsList> : ''}
    </div>
  );
}

const CardsList = (props) => {

  const [cardsData, setCardsData] = useState([]);
  
  const cardElements = cardsData.map((card) => {
    return (<div>{card.message}</div>)
  });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/boards/${props.board.board_id}/cards`).then((response)=> {
      setCardsData(response.data);
    })
  }, [props.board]);

  const submitNewCard = (e) => {
    e.preventDefault();
    axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/boards/${props.board.board_id}/cards`,
        {message}
    ).then((response) => {
      console.log("response datatst", response.data.card);
      const cards = [...cardsData];
      cards.push(response.data.card);
      setCardsData(cards);
      setMessage('');
    }).catch((error) => {
      console.log("errororoorroor", error);
    });
  };

  const [message, setMessage] = useState('');
  const handleMessageChange = (e) => { setMessage(e.target.value) };

  return (<section>
      <h2>:D Cards for Selected Board: {props.board.title} - {props.board.owner}</h2>
      {cardElements}
      <section>
        <h2>Create a New Card</h2>
        <form onSubmit={submitNewCard}>
          <label>Message</label>
          <input type="text" onChange={handleMessageChange}></input>
          <input type="Submit"></input>
        </form>
        <p>Preview: {message}</p>
      </section>
    </section>)
};

export default App;
