import React, {useMemo} from "react";
import { useSelector } from 'react-redux'
import Info from '../info/Info'
import Todo from '../todo/Todo'
import SideMenu from '../menu/SideMenu'
import './style.css';

export default function MainLayout () {
  const { cardsState, openInfo, language } = useSelector((state) => state.cards)
  const emptyCards = useMemo(() => !cardsState || cardsState.length === 0,[cardsState])

  return (
      <div className={`main-layout ${openInfo ? 'info-open' : ''}`}>
        <Info />
        <div className="main-content">
          <SideMenu language={language} disableResetApp={emptyCards}/>
          <Todo cards={cardsState} emptyCards={emptyCards}/>
        </div>
      </div>
  )
}
