import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {openModal, handleDrag, handleDrop, elementsTypes, modalsTypes} from '../../store/reducers/cardsSlice'
import Task from "../task/Task";
import './style.css';

export default function Card ({card}) {
  const dispatch = useDispatch()

  const handleDragStartTask = useCallback((task) => dispatch(handleDrag({ type: elementsTypes.task, task: task, card: card })), [card, dispatch])
  const handleDragStartCard = useCallback(() => dispatch(handleDrag({ type: elementsTypes.card, card: card })), [dispatch, card])
  const handleDropTask = useCallback((task) => dispatch(handleDrop({type: elementsTypes.task, task: task, card: card})), [dispatch, card])
  const handleDropCard = useCallback((e) => {
    e.preventDefault()
    dispatch(handleDrop({type: elementsTypes.card, card: card}))
  }, [card, dispatch])

 const handleClick  = useCallback((e) => dispatch(openModal({type: modalsTypes[e.target.id], cardId: card.id})), [card.id, dispatch])

  return (
      <div
          className="card"
          draggable
          onDragStart={handleDragStartCard}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropCard}
      >
        <div className="title">
          <div className="title-text">{card.title}</div>
          <button id={modalsTypes.addTask} className='add-task-button' onClick={handleClick}>+</button>
        </div>
        <div className="tasks">
          {card.tasks.map((task) => (
              <Task
                  key={task.id}
                  task={task}
                  card={card}
                  handleDragStartTask={handleDragStartTask}
                  handleDropTask={handleDropTask}
              />
          ))}
        </div>
        <div id={modalsTypes.deleteCard} className='delete-card' onClick={handleClick}>Удалить группу</div>
      </div>
  )
}
