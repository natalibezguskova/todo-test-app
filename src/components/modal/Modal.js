import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {onConfirmModal, closeModal, modalsTypes} from '../../store/reducers/cardsSlice'
import Input, {inputLabels, inputPlaceholders} from "../input/Input";
import useLanguage from '../../hooks/useLanguage'
import './style.css';

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

  const text = useLanguage(props.type)
  const buttonText = {
    confirm: useLanguage("button_confirm"),
    delete: useLanguage("button_delete"),
    cancel: useLanguage("button_cancel"),
  }
  const emptyTaskText = useLanguage('empty_task')

  const header = useMemo(() => props.type === modalsTypes.openTask ? props.task.title : text.title, [props.type, text])
  const description = useMemo(() => {
    if (props.type === modalsTypes.openTask) return (!props.task.title && !props.task.description) ? emptyTaskText : props.task.description
    return text.description
  }, [props.type, text, props.task])
  const confirmButton = useMemo(() => {
    if (props.type === modalsTypes.openTask) return <button onClick={handleConfirm} className="confirm">{buttonText.delete}</button>
    return <button onClick={handleConfirm} className="confirm">{buttonText.confirm}</button>
  }, [props.type, text, props.task, buttonText])

  const inputs = useMemo(() => {
    if (props.type === modalsTypes.addCard) return <Input onChange={handleCardHeader}/>
    if (props.type === modalsTypes.addTask) return <>
      <Input onChange={handleTaskHeader}/>
      <Input onChange={handleTaskDescription} placeholder={inputPlaceholders.description} label={inputLabels.description}/>
    </>
    if (props.type === modalsTypes.editTask) return <>
      <Input onChange={handleTaskHeader} initValue={props.task.title}/>
      <Input onChange={handleTaskDescription} placeholder={inputPlaceholders.description} initValue={props.task.description} label={inputLabels.description}/>
    </>
    return null
  }, [handleCardHeader, handleConfirm, handleTaskDescription, handleTaskHeader, props.task, props.type])

  return (
      <div className='modal-wrap'>
        <div className="modal-backdrop cursor" onClick={handleCancel}/>
        <div className="modal">
          <div className="modal-header">{header}</div>
          <div className="modal-inner">
            <div>{description}</div>
            {inputs}
          </div>
          <div className="modal-footer">
            {confirmButton}
            <button onClick={handleCancel} className="cancel">{buttonText.cancel}</button>
          </div>
        </div>
      </div>
  )
}
