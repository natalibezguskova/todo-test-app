import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {onConfirmModal, closeModal, modalsTypes} from '../../store/reducers/cardsSlice'
import Input, {inputLabels, inputPlaceholders} from "../input/Input";
import './style.css';

export const modalsHeaderText = {
  addCard: 'Создать новую группу',
  addTask: 'Добавить задание',
  deleteCard: 'Удалить группу',
  editTask: 'Редактировать задание',
}

export const modalsDescriptionText = {
  addCard: 'Для создания новой группы необходимо указать заголовок группы.',
  addTask: 'Для добавления нового задания укажите его заголовок и описание.',
  deleteCard: 'Вы уверены, что хотите удалить группу?',
  editTask: 'Вы можете отредактировать или удалить заголовок и описание задания.',
}

export default function Modal (props) {
  const [value, setValue] = useState({
    title: '',
    description: ''
  })
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.type === modalsTypes.editTask) setValue({title: props.task.title, description: props.task.description})
  }, [props])

  const handleCancel = useCallback(() => dispatch(closeModal()), [dispatch])
  const handleConfirm = useCallback(() => dispatch(onConfirmModal(value)), [dispatch, value])

  const handleCardHeader = useCallback((info) => setValue({title: info, description: ''}), [])
  const handleTaskHeader = useCallback((info) => setValue(prev => ({ ...prev, title: info})), [])
  const handleTaskDescription = useCallback((info) => setValue(prev => ({ ...prev, description: info})), [])

  const [header, description, confirmButton, inputs] = useMemo(() => {
    switch (props.type) {
      case (modalsTypes.addTask): {
        return [
          modalsHeaderText[props.type],
          modalsDescriptionText[props.type],
          <button onClick={handleConfirm} className="confirm">Подвердить</button>,
          <>
            <Input onChange={handleTaskHeader}/>
            <Input onChange={handleTaskDescription} placeholder={inputPlaceholders.description} label={inputLabels.description}/>
          </>
        ]
      }
      case (modalsTypes.deleteCard): {
        return [
          modalsHeaderText[props.type],
          modalsDescriptionText[props.type],
          <button onClick={handleConfirm} className="confirm">Подвердить</button>,
          null
        ]
      }
      case (modalsTypes.editTask): {
        return [
          modalsHeaderText[props.type],
          modalsDescriptionText[props.type],
          <button onClick={handleConfirm} className="confirm">Подвердить</button>,
          <>
            <Input onChange={handleTaskHeader} initValue={props.task.title}/>
            <Input onChange={handleTaskDescription} placeholder={inputPlaceholders.description} initValue={props.task.description} label={inputLabels.description}/>
          </>
        ]
      }
      case (modalsTypes.openTask): {
        return [
          props.task.title,
          props.task.description,
          <button onClick={handleConfirm} className="confirm">Удалить</button>,
          null
        ]
      }
      default: {
        // modalsTypes.addCard
        return [
          modalsHeaderText[props.type],
          modalsDescriptionText[props.type],
          <button onClick={handleConfirm} className="confirm">Подвердить</button>,
          <Input onChange={handleCardHeader}/>
        ]
      }
    }
  }, [handleCardHeader, handleConfirm, handleTaskDescription, handleTaskHeader, props.task, props.type])

  return (
      <div className='modal-wrap'>
        <div className="modal-backdrop cursor" onClick={handleCancel}/>
        <div className="modal">
          <div className="modal-header">{header}</div>
          <div className="modal-inner">
            <div>{(!header && !description) ? "В задаче нет заголовка и описания." : description}</div>
            {inputs}
          </div>
          <div className="modal-footer">
            {confirmButton}
            <button onClick={handleCancel} className="cancel">Закрыть</button>
          </div>
        </div>
      </div>
  )
}
