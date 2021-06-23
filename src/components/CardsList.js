import axios from 'axios';
import { useState, useEffect } from 'react';
import Card from './Card';

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
    return (<Card
        card={card}
        plusOneCardItem={plusOneCardItem}
        deleteCardItem={deleteCardItem}></Card>)
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
          <input
            type="text"
            className={((message.length === 0) || (message.length > 40)) ? 'invalid-form-input' : ''}
            onChange={handleMessageChange}
            value={message}></input>
          <p>Preview: {message}</p>
          <input
            type="Submit"
            disabled={((message.length === 0) || (message.length > 40))}
            className='new-card-form__form-submit-btn'></input>
        </form>
      </section>
    </section>)
};

export default CardsList;