import React, { useMemo} from "react";
import { useSelector } from 'react-redux'
import {locales} from '../../store/locales'
import './style.css';
export default function Info () {
  const { language } = useSelector((state) => state.cards)
  const currentLang = useMemo(() => locales[language], [language])
  return (
      <div className="info">
        <div>{currentLang.info.about}</div>
        <div>{currentLang.info.functionality}</div>
        <ul>
          <li>{currentLang.info.topic_1}</li>
          <li>{currentLang.info.topic_2}</li>
          <li>{currentLang.info.topic_3}</li>
          <li>{currentLang.info.topic_4}</li>
          <li>{currentLang.info.topic_5}</li>
          <li>{currentLang.info.topic_6}</li>
          <li>{currentLang.info.topic_7}</li>
          <li>{currentLang.info.topic_8}</li>
       </ul>
      </div>
  )
}
