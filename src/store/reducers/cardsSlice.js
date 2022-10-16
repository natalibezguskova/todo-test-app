import {createSlice} from '@reduxjs/toolkit'
import uniqid from 'uniqid';

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

const storage = localStorage.getItem('storage')
const parsedStorage = (storage && storage !== 'undefined') ? JSON.parse(storage) : []
const sortedCards = (arr) => arr.sort((a, b) => {
  if (a.order > b.order) {
    return 1
  } else {
    return -1
  }
})
const sortedStorage = parsedStorage.length ? sortedCards(parsedStorage) : []

const initialState = {
  cardsState: sortedStorage,
  modalLayer: null,
  draggedElement: null,
  clickedElement: null,
}

export const counterSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    saveToLocalStorage: (state, action) => {
      localStorage.setItem('storage', JSON.stringify(action.payload))
      state.cardsState = sortedCards(JSON.parse(localStorage.getItem('storage')))
    },
    resetApp: (state, action) => {
      counterSlice.caseReducers.saveToLocalStorage(state, { payload: []})
    },
    reorderCards: (state, action) => {
      const updatedCards = state.cardsState.map((el) => {
        if (el.id === action.payload.card.id) {
          return {...el, order: state.draggedElement.card.order}
        }
        if (el.id === state.draggedElement.card.id) {
          return {...el, order: action.payload.card.order}
        }
        return el
      })
      counterSlice.caseReducers.saveToLocalStorage(state, {payload: updatedCards})
    },
    handleDrag: (state, action) => {
      state.draggedElement = action.payload
      // counterSlice.caseReducers.saveToLocalStorage(state, action)
    },
    handleDrop: (state, action) => {
      if (action.payload.type === elementsTypes.card) {
        switch (state.draggedElement.type) {
          //from task to card
          case (elementsTypes.task): {
            // check if this is the same card - if not update tasks
            if (action.payload.card.id !== state.draggedElement.card.id) {
              // delete task from old card
              const movedTaskIndex = state.draggedElement.card.tasks.indexOf(state.draggedElement.task)
              state.draggedElement.card.tasks.splice(movedTaskIndex, 1)
              // add task to the new card
              state.cardsState = state.cardsState.map((el) => {
                if (el.id === action.payload.card.id) {
                  el.tasks.push(state.draggedElement.task)
                  return el
                }
                if (el.id === state.draggedElement.card.id) {
                  el.tasks = el.tasks.filter((t) => t.id !== state.draggedElement.task.id)
                  return el
                }
                return el
              })
            }
            break;
          }
            //from card to card
          default: {
            counterSlice.caseReducers.reorderCards(state, {
              payload: action.payload
            });
          }
        }
      }
      if (action.payload.type === elementsTypes.task) {
        switch (state.draggedElement.type) {
            //from task to task
          case (elementsTypes.task): {
            const { task, card } = action.payload
            const dropOnTaskIndex = card.tasks.indexOf(task)
            const dropToIndex = () => {
              if (dropOnTaskIndex === 0) return 0
              return dropOnTaskIndex + 1
            }
            state.cardsState = state.cardsState.map((el) => {
              if (el.id === action.payload.card.id) {
                el.tasks = el.tasks.filter((t) => t.id !== state.draggedElement.task.id)
                el.tasks = [...el.tasks.slice(0, dropToIndex()), state.draggedElement.task, ...el.tasks.slice(dropToIndex())]
                return el
              }
              if (el.id === state.draggedElement.card.id) {
                el.tasks = el.tasks.filter((t) => t.id !== state.draggedElement.task.id)
                return el
              }
              return el
            })
            break;
          }
            //from card to card
          default: {
            counterSlice.caseReducers.reorderCards(state, {
              payload: action.payload
            });
          }
        }
      }
      // counterSlice.caseReducers.saveToLocalStorage(state, action)
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
              if (card.id === state.modalLayer.cardId) card.tasks.push({ id: uniqid(), ...action.payload})
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
            updatedCards = cardsWithUpdatedOrders.filter((card) => card.id !== state.modalLayer.cardId)
            break
          }
          case modalsTypes.openTask: {
            // in opened task confirm button = delete task button
            const cardWithUpdatedTasks = state.modalLayer.card.tasks.filter((task) => task.id !== state.modalLayer.task.id)
            updatedCards = state.cardsState.map((card) => {
              if (card.id === state.modalLayer.card.id) card.tasks = cardWithUpdatedTasks
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
        // state.cardsState = updatedCards
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
  },
})

export const { resetApp, closeModal, openModal, onConfirmModal, handleDrag, handleDrop } = counterSlice.actions

export default counterSlice.reducer
