import React, {useCallback, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {resetApp, openModal,  modalsTypes} from '../../store/reducers/cardsSlice'
import './style.css';

export default function Header ({disableResetApp}) {
  const [sideMenuOpened, setSideMenuOpened] = useState(false)
  const dispatch = useDispatch()

  const onReset = useCallback(() => {
    dispatch(resetApp())
    if (sideMenuOpened) setSideMenuOpened(false)
  }, [dispatch, sideMenuOpened])

  const onAdd = useCallback(() => {
    dispatch(openModal({ type: modalsTypes.addCard }))
    if (sideMenuOpened) setSideMenuOpened(false)
  }, [dispatch, sideMenuOpened])

  const actionButtons = useMemo(() => {
    return (
        <>
          <button onClick={onReset} disabled={disableResetApp}>Очистить приложение</button>
          <button onClick={onAdd}>Добавить группу</button>
        </>
    )
  }, [onReset, disableResetApp, onAdd])

  return (
      <>
        {/*<div className={sideMenuOpened ? 'side-menu' : 'side-menu opened'}>*/}
        {/*  {actionButtons}*/}
        {/*</div>*/}
        <div className="header">
          <div className='tablet-and-mobile-button'>
            <button onClick={() => setSideMenuOpened(!sideMenuOpened)}>|||</button>
          </div>
          <div className='desktop-buttons'>
            {actionButtons}
          </div>
        </div>
      </>
  )
}
