import './App.css';
import React, {useMemo} from 'react'
import { useSelector } from 'react-redux'
import Header from "./components/header/Header";
import Todo from "./components/todo/Todo";
import Modal from "./components/modal/Modal";

const App = () => {
  const { cardsState, modalLayer } = useSelector((state) => state.cards)
  const emptyCards = useMemo(() => !cardsState || cardsState.length === 0,[cardsState])

  return (
      <>
        {modalLayer && <Modal {...modalLayer}/>}
        <Header disableResetApp={emptyCards}/>
        <Todo cards={cardsState} emptyCards={emptyCards}/>
      </>
  );
}

export default App;
