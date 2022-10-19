import React, { useMemo} from "react";
import { useSelector } from 'react-redux'
import {locales} from '../../store/locales'
import useLanguage from '../../hooks/useLanguage'
import './style.css';
export default function Info () {
  const { language } = useSelector((state) => state.cards)
  const currentLang = useMemo(() => locales[language], [language])
  return (
      <div className="info">
        <div>{useLanguage("info_about")}</div>
        <div>{useLanguage("info_functionality")}</div>
        <ul>
          <li>{useLanguage("info_topic_1")}</li>
          <li>{useLanguage("info_topic_2")}</li>
          <li>{useLanguage("info_topic_3")}</li>
          <li>{useLanguage("info_topic_4")}</li>
          <li>{useLanguage("info_topic_5")}</li>
          <li>{useLanguage("info_topic_6")}</li>
          <li>{useLanguage("info_topic_7")}</li>
          <li>{useLanguage("info_topic_8")}</li>
       </ul>
      </div>
  )
}
