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
    return (<li>
      <div onClick={() => { selectBoard(board) }}>{board.title}</div>
    </li>)
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

  const [isBoardVisible, setIsBoardVisible] = useState(true);

  const NewBoardForm = (<form onSubmit={submitNewBoard} className='new-board-form__form'>
          <label>Title</label>
          <input
            type="text"
            onChange={handleTitleChange}
            className={title.length === 0 ? 'invalid-form-input' : ''}></input>
          <label>Owner's Name</label>
          <input
            type="text"
            onChange={handleOwnerChange}
            className={owner.length === 0 ? 'invalid-form-input' : ''}></input>
          <p>Preview: {title} - {owner}</p>
          <input
            type="Submit"
            disabled={((title.length === 0) || (owner.length === 0))}
            className='new-board-form__form-submit-btn'></input>
        </form>);

  const toggleNewBoardForm = () => {setIsBoardVisible(!isBoardVisible)}

  return (
    <div>
      <h1>Inspiration Board</h1>
      <section className="boards__container">
        <section>
          <h2>Boards</h2>
          <ol>
            {boardsElements}
          </ol>
        </section>
        <section>
          <h2>Selected Board</h2>
          <p>{selectedBoard.board_id ? `${selectedBoard.title} by ${selectedBoard.owner}` : 'Select a Board from the Board List!'}</p>
        </section>
        <section className='new-board-form__container'>
          <h2>Create a New Board</h2>
          {isBoardVisible ? NewBoardForm : ''}
          <span onClick={toggleNewBoardForm} className='new-board-form__toggle-btn'>{isBoardVisible ? 'Hide New Board Form' : 'Show New Board Form'}</span>
        </section>
      </section>
      {selectedBoard.board_id ? <CardsList board={selectedBoard}></CardsList> : ''}
    </div>
  );
}

const CardsList = (props) => {

  const [cardsData, setCardsData] = useState([]);

  const deleteCardItem = (card) => {
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/boards/${props.board.board_id}/cards/${card.card_id}`).then((response) => {
      const newCardsData = cardsData.filter((existingCard) => {
        return existingCard.card_id !== card.card_id;
      });
      setCardsData(newCardsData);
    }).catch((error) => {
      console.log("errororoorroor", error);
    });
  };

  const plusOneCardItem = (card) => {
    axios.put(`${process.env.REACT_APP_BACKEND_URL}/boards/${props.board.board_id}/cards/${card.card_id}/like`).then((response) => {
      const newCardsData = cardsData.map((existingCard) => {
        return existingCard.card_id !== card.card_id ? existingCard : {...card, likes_count: card.likes_count + 1}
      });
      setCardsData(newCardsData);
    }).catch((error) => {
      console.log("errororoorroor", error);
    });
  };
  
  const cardElements = cardsData.map((card) => {
    return (<div className='card-item'>
      
      <p className='card-item__message'>{card.message}</p>
      <ul className='card-item__controls'>
        <li><p>{card.likes_count} 💕</p></li>
        <li><p onClick={() => plusOneCardItem(card)}>+1</p></li>
        <li><p className='card-item__delete' onClick={() => deleteCardItem(card)}>Delete</p></li>
      </ul>
    </div>)
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

  return (<section className='cards__container'>
      <section>
        <h2>Cards for {props.board.title}</h2>
        <div className='card-items__container'>
          {cardElements}
        </div>
      </section>
      <section className='new-card-form__container'>
        <h2>Create a New Card</h2>
        <form onSubmit={submitNewCard} className='new-card-form__form'>
          <label>Message</label>
          <input type="text" onChange={handleMessageChange}></input>
          <p>Preview: {message}</p>
          <input type="Submit" className='new-card-form__form-submit-btn'></input>
        </form>
      </section>
    </section>)
};

export default App;
