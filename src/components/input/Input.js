import React, {useCallback, useEffect, useState} from "react";
import './style.css';

export const inputLabels = {
  header: 'Заголовок',
  description: 'Описание',
}
export const inputPlaceholders = {
  header: 'Введите заголовок',
  description: 'Введите описание',
}

export default function Input ({initValue, onChange, placeholder = inputPlaceholders.header, label= inputLabels.header}) {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (initValue) setValue(initValue)
  }, [initValue])

  const handleChange = useCallback((e) => {
    setValue(e.target.value)
    onChange(e.target.value)
  }, [onChange])

  const handleDelete = useCallback(() => {
    setValue('')
    onChange('')
  }, [onChange])

  return (
      <div className="input-info">
        <div className="label">{label}</div>
        <div className="input">
          <input type='text' placeholder={placeholder} value={value} onChange={handleChange}/>
          <div className='input-clear' onClick={handleDelete}>+</div>
        </div>
      </div>
  )
}
