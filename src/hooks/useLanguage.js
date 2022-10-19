import React, {useMemo} from "react";
import { useSelector } from 'react-redux'
import {locales} from '../store/locales'

export default function useLanguage(text) {
  const { language } = useSelector((state) => state.cards)
  return useMemo(() => locales[language][text], [language])
}
