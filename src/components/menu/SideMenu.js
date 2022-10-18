import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {modalsTypes, openModal, toggleInfo, toggleLanguage} from "../../store/reducers/cardsSlice";
import { ReactComponent as ArrowIcon } from '../../icons/info.svg'
import './style.css';

export default function SideMenu ({language}) {
  const dispatch = useDispatch()
  const onAdd = useCallback(() => dispatch(openModal({ type: modalsTypes.addCard })), [dispatch])
  return (
      <div className="menu">
        <div className='menu-item name'>
        ToDo App
        </div>
        <div className='menu-item'>
          <ArrowIcon onClick={() => dispatch(toggleInfo())}/>
        </div>
        <div className='menu-item lang' onClick={() => dispatch(toggleLanguage())}>{language}
        </div>
        <button onClick={onAdd}>Добавить группу</button>
      </div>
  )
}
