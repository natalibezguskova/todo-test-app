import React from "react";
import { useSelector } from 'react-redux'
import Info from '../info/Info'
import Todo from '../todo/Todo'
import SideMenu from '../menu/SideMenu'
import './style.css';

export default function MainLayout () {
  const { cardsState, openInfo, language } = useSelector((state) => state.cards)

  return (
      <div className={`main-layout ${openInfo ? 'info-open' : ''}`}>
        <Info />
        <div className="main-content">
          <SideMenu language={language}/>
          <Todo cards={cardsState}/>
        </div>
      </div>
  )
}
