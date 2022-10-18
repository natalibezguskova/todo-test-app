import React, { useMemo} from "react";
import { useSelector } from 'react-redux'
import {locales} from '../../store/locales'
import './style.css';
export default function Info () {
  const { language } = useSelector((state) => state.cards)
  const currentLang = useMemo(() => locales[language], [language])
  return (
      <div className="info">
        {currentLang.info.about}
        Функционал:
        <ul>
          <li>Создание карточки задач с заголовком.</li>
          <li>Добавление задачи с заголовком и описанием (опционально)</li>
          <li>Просмотр задачи (полное описание, заголовок) и редактирование в модальном окне</li>
          <li>Возможность удаления карточки задач вместе с задачами/ удаление конкретной задачи</li>
          <li>Ручное перемещение задач внутри группы и между группами, ручное изменение порядка карточек с задачами с помощью перемещения</li>
          <li>Возможность полной очистки приложения</li>
          <li>Локальное состояние сохраняется в браузере</li>
          <li>Адаптация интерфейса для десктопов, таблетов и мобильных устройств.</li>
        </ul>
      </div>
  )
}
