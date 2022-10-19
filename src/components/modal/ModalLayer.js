import React from "react";
import { useSelector } from 'react-redux'
import Modal from '../modal/Modal'

export default function ModalLayer ({ children}) {
  const { modalLayer } = useSelector((state) => state.cards)
  return (
      <>
        {modalLayer && <Modal {...modalLayer}/>}
        {children}
      </>
  )
}
