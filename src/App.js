import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import CardsList from './components/CardsList';

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
      setTitle('');
      setOwner('');
    }).catch((error) => {
      console.log("errororoorroor", error);
    });
  };

  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const handleTitleChange = (e) => { setTitle(e.target.value) };
  const handleOwnerChange = (e) => { setOwner(e.target.value) };

  const [isBoardFormVisible, setIsBoardFormVisible] = useState(true);

  const NewBoardForm = (<form onSubmit={submitNewBoard} className='new-board-form__form'>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className={title.length === 0 ? 'invalid-form-input' : ''}></input>
          <label>Owner's Name</label>
          <input
            type="text"
            value={owner}
            onChange={handleOwnerChange}
            className={owner.length === 0 ? 'invalid-form-input' : ''}></input>
          <p>Preview: {title} - {owner}</p>
          <input
            type="Submit"
            disabled={((title.length === 0) || (owner.length === 0))}
            className='new-board-form__form-submit-btn'></input>
        </form>);

  const toggleNewBoardForm = () => {setIsBoardFormVisible(!isBoardFormVisible)}

  const deleteAll = () => {
    if (window.confirm('Are you really sure? Please be gentle with this demo.')) {
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}/destroy_all`).then((response) => {
        setBoardsData([]);
        setSelectedBoard({
          title: '',
          owner: '',
          board_id: null
        });
      }).catch((error) => {
        console.log('Error:', error);
        alert('Something went wrong! :(');
      });
    }
  }

  return (
    <div className="page__container">
      <div className="content__container">
        <h1>Inspiration Board</h1>
        <section className="boards__container">
          <section>
            <h2>Boards</h2>
            <ol className="boards__list">
              {boardsElements}
            </ol>
          </section>
          <section>
            <h2>Selected Board</h2>
            <p>{selectedBoard.board_id ? `${selectedBoard.title} - ${selectedBoard.owner}` : 'Select a Board from the Board List!'}</p>
          </section>
          <section className='new-board-form__container'>
            <h2>Create a New Board</h2>
            {isBoardFormVisible ? NewBoardForm : ''}
            <span onClick={toggleNewBoardForm} className='new-board-form__toggle-btn'>{isBoardFormVisible ? 'Hide New Board Form' : 'Show New Board Form'}</span>
          </section>
        </section>
        {selectedBoard.board_id ? <CardsList board={selectedBoard}></CardsList> : ''}
      </div>
      <footer><span>This is a demo! Please be gentle!</span> Click <span onClick={deleteAll} className="footer__delete-btn">here</span> to delete all boards and cards!</footer>
    </div>
  );
}


export default App;
