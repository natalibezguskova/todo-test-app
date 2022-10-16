import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {modalsTypes, openModal} from "../../store/reducers/cardsSlice";
import './style.css';

export default function Task ({card, task, handleDragStartTask, handleDropTask}) {
  const dispatch = useDispatch()
  const handleDragStart = useCallback((e) => {
    e.stopPropagation()
    handleDragStartTask(task)
  }, [handleDragStartTask, task])

  const handleDragOver = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.target.className === 'task') {
      e.target.boxShadow = '0 2px 3px'
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    handleDropTask(task)
  }, [handleDropTask, task])

  const handleTaskClick  = useCallback(() => dispatch(openModal({type: modalsTypes.openTask, task: task, card: card})), [dispatch, task, card])
  const handleEditTask  = useCallback((e) => {
    e.stopPropagation()
    dispatch(openModal({type: modalsTypes.editTask, task: task, card: card}))
  }, [dispatch, task, card])

  return (
      <div className="task"
           draggable
           onDragStart={handleDragStart}
           onDragOver={handleDragOver}
           onDrop={handleDrop}
           onClick={handleTaskClick}
      >
        <div className="task-content">
          <div className="task-title">{task.title}</div>
          <div className="cutted-preview">{task.description}</div>
        </div>
        <div className="task-edit" onClick={handleEditTask}>...</div>
      </div>
  )
}
