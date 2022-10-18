import {createSlice} from '@reduxjs/toolkit'
import uniqid from 'uniqid';
import {removeItemFromArrayById, sortedByOrder, sortedArdReorderedArray, updateTasksInCardsArray} from "../utils";

export const modalsTypes = {
  addCard: 'addCard',
  addTask: 'addTask',
  deleteCard: 'deleteCard',
  editTask: 'editTask',
  openTask: 'openTask',
}

export const elementsTypes = {
  card: 'card',
  task: 'task',
}

export const languageTypes = {
  RU: 'RU',
  EN: 'EN',
}

const storage = localStorage.getItem('storage')
const parsedStorage = (storage && storage !== 'undefined') ? JSON.parse(storage) : []
const sortedStorage = parsedStorage.length ? sortedByOrder(parsedStorage) : []

const initialState = {
  cardsState: sortedStorage,
  modalLayer: null,
  openInfo: false,
  draggedElement: null,
  language: languageTypes.RU
}

export const counterSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    saveToLocalStorage: (state, action) => {
      localStorage.setItem('storage', JSON.stringify(action.payload))
      state.cardsState = sortedByOrder(JSON.parse(localStorage.getItem('storage')))
    },
    resetApp: (state, action) => {
      state.draggedElement = initialState.draggedElement
      state.modalLayer = initialState.modalLayer
      counterSlice.caseReducers.saveToLocalStorage(state, { payload: []})
    },
    toggleLanguage: (state, action) => {
      const newLang = state.language === languageTypes.RU ? languageTypes.EN : languageTypes.RU
      state.language = newLang
    },
    reorder: (state, action) => {
      const array = action.payload.type === elementsTypes.card ? state.cardsState : action.payload.card.tasks
      const fromElement = action.payload.type === elementsTypes.card ? state.draggedElement.card : state.draggedElement.task
      const toElement = action.payload.type === elementsTypes.card ? action.payload.card : action.payload.task
      return array.map((el) => {
        if (el.id === toElement.id) {
          return {...el, order: fromElement.order}
        }
        if (el.id === fromElement.id) {
          return {...el, order: toElement.order}
        }
        return el
      })
    },
    reorderCards: (state, action) => {
      const updatedCards = counterSlice.caseReducers.reorder(state, {payload: {...action.payload, type: elementsTypes.card}})
      counterSlice.caseReducers.saveToLocalStorage(state, {payload: updatedCards})
    },
    updateCards: (state, action) => {
      const {card: fromCard, task: fromTask} = state.draggedElement
      const {card: toCard, updateTasks, order} = action.payload
      const updatedTasks = [...updateTasks, {...state.draggedElement.task, order: order}]
      const updatedCards = updateTasksInCardsArray(state.cardsState, updatedTasks, fromCard.id, toCard.id, fromCard.tasks, fromTask.id, fromTask.order)
      counterSlice.caseReducers.saveToLocalStorage(state, {payload: updatedCards})
    },
    handleDrag: (state, action) => {
      state.draggedElement = action.payload
    },
    handleDrop: (state, action) => {
      if (action.payload.type === elementsTypes.card) {
        switch (state.draggedElement.type) {
          //from task to card
          case (elementsTypes.task): {
            // move task only if this is not the same card
            if (action.payload.card.id !== state.draggedElement.card.id) {
              counterSlice.caseReducers.updateCards(state, {payload: {...action.payload, updateTasks: action.payload.card.tasks, order: action.payload.card.tasks.length + 1}})
            }
            break;
          }
            //from card to card
          default: {
            counterSlice.caseReducers.reorderCards(state, action);
          }
        }
      }
      if (action.payload.type === elementsTypes.task) {
        switch (state.draggedElement.type) {
            //from task to task
          case (elementsTypes.task): {
            const {card: fromCard, task: fromTask} = state.draggedElement
            const {card: toCard, task: toTask} = action.payload
            if (toCard.id === fromCard.id) {
              // just reorder tasks inside the same card
              const updatedTasks = counterSlice.caseReducers.reorder(state, {payload: {...action.payload, type: elementsTypes.task}})
              const updatedCards = state.cardsState.map((card) => {
                if (card.id === toCard.id) card.tasks = sortedByOrder(updatedTasks)
                return card
              })
              counterSlice.caseReducers.saveToLocalStorage(state, {payload: updatedCards})
            } else {
              const reorderedTasks = toCard.tasks.map((task) => {
                if (task.order >= toTask.order) return {...task, order: task.order + 1}
                return task
              })
              counterSlice.caseReducers.updateCards(state, {payload: {...action.payload, updateTasks: reorderedTasks, order: action.payload.task.order}})
            }
            break;
          }
            //from card to card
          default: {
            counterSlice.caseReducers.reorderCards(state, action);
          }
        }
      }
    },
    onConfirmModal: (state, action) => {
      if (state.modalLayer) {
        let updatedCards;
        switch (state.modalLayer.type) {
          case modalsTypes.addCard: {
            updatedCards = [...state.cardsState, { id: uniqid(), ...action.payload, order: state.cardsState.length + 1, tasks: []}]
            break
          }
          case modalsTypes.addTask: {
            updatedCards = state.cardsState.map((card) => {
              if (card.id === state.modalLayer.cardId) {
                return { ...card, tasks: [...card.tasks, {id: uniqid(), order: card.tasks.length + 1, ...action.payload}]}
              }
              return card
            })
            break
          }
          case modalsTypes.deleteCard: {
            const orderOfDeletingCard = state.cardsState.find(card => card.id === state.modalLayer.cardId).order;
            const cardsWithUpdatedOrders = state.cardsState.map((card) => {
              if (card.id !== state.modalLayer.cardId && card.order > orderOfDeletingCard) card.order = card.order - 1
              return card
            })
            updatedCards = removeItemFromArrayById(cardsWithUpdatedOrders, state.modalLayer.cardId)
            break
          }
          case modalsTypes.openTask: {
            // in opened task confirm button = delete task button
            updatedCards = state.cardsState.map((card) => {
              if (card.id === state.modalLayer.card.id) card.tasks = sortedArdReorderedArray(state.modalLayer.card.tasks, state.modalLayer.task.id, state.modalLayer.task.order)
              return card
            })
            break
          }
          case modalsTypes.editTask: {
            const cardWithUpdatedTasks = state.modalLayer.card.tasks.map((task) => {
              if (task.id === state.modalLayer.task.id) {
                task.title = action.payload.title
                task.description = action.payload.description
              }
              return task
            })
            updatedCards = state.cardsState.map((card) => {
              if (card.id === state.modalLayer.card.id) card.tasks = cardWithUpdatedTasks
              return card
            })
            break
          }
          default: {
            console.warn('There is no such action for modal')
          }
        }
        counterSlice.caseReducers.saveToLocalStorage(state, {payload: updatedCards})
        counterSlice.caseReducers.closeModal(state, action)
      }
    },
    openModal: (state, action) => {
      state.modalLayer = {...action.payload}
    },
    closeModal: (state, action) => {
      state.modalLayer = initialState.modalLayer
    },
    toggleInfo: (state, action) => {
      state.openInfo = !state.openInfo
    },
  },
})

export const { resetApp, closeModal, openModal, onConfirmModal, handleDrag, handleDrop, toggleInfo, toggleLanguage } = counterSlice.actions

export default counterSlice.reducer
