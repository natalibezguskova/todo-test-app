import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {openModal, handleDrag, handleDrop, elementsTypes, modalsTypes} from '../../store/reducers/cardsSlice'
import Task from "../task/Task";
import { ReactComponent as TrashCanIcon } from '../../icons/trash-can.svg'
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

  const handleAddTask  = useCallback((e) => dispatch(openModal({type: modalsTypes.addTask, cardId: card.id})), [card.id, dispatch])
  const handleDeleteCard  = useCallback((e) => dispatch(openModal({type: modalsTypes.deleteCard, cardId: card.id})), [card.id, dispatch])

  return (
      <div
          className="card"
          draggable
          onDragStart={handleDragStartCard}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropCard}
      >
        <div className="title">
          <div className="cutted-preview">{card.title}</div>
          <button className="delete-icon" onClick={handleDeleteCard}>
            <TrashCanIcon width="20px" height="20px" fill="#fff9b2"/>
          </button>
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
        <div id={modalsTypes.addTask} className='add-card-button cursor' onClick={handleAddTask}>Добавить задание</div>
      </div>
  )
}
