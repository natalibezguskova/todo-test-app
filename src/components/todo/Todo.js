import React, {useMemo} from "react";
import Card from "../card/Card";
import './style.css';
export default function Todo ({cards, emptyCards}) {
  if (emptyCards) return <div className='todo empty'>У вас пока нет групп с задачами. Начните, добавив новую группу.</div>
  return (
      <div className="todo">
        {cards.map((card) => <Card key={card.id} card={card}/>)}
      </div>
  )
}
