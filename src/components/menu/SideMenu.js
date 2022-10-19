import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {modalsTypes, openModal, toggleInfo, toggleLanguage, resetApp} from "../../store/reducers/cardsSlice";
import { ReactComponent as InfoIcon } from '../../icons/info.svg'
import { ReactComponent as PlusIcon } from '../../icons/plus.svg'
import { ReactComponent as ResetIcon } from '../../icons/rotate.svg'
import './style.css';

export default function SideMenu ({language, disableResetApp}) {
  const dispatch = useDispatch()
  const onAdd = useCallback(() => dispatch(openModal({ type: modalsTypes.addCard })), [dispatch])
  const onReset = useCallback(() => dispatch(resetApp()), [dispatch])

  return (
      <div className="menu">
        <div>
          <div className='name'>
            ToDo App
          </div>
          <button onClick={onAdd}>
            <PlusIcon onClick={onAdd}/>
          </button>
          <button onClick={onReset} disabled={disableResetApp}>
            <ResetIcon/>
          </button>
        </div>
        <div >
          <button className='lang' onClick={() => dispatch(toggleLanguage())}>
            {language}
          </button>
          <button onClick={() => dispatch(toggleInfo())}>
            <InfoIcon />
          </button>
        </div>
      </div>
  )
}
