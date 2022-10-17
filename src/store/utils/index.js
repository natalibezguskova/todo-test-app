export const sortedByOrder = (arr) => arr.sort((a, b) => {
  if (a.order > b.order) {
    return 1
  } else {
    return -1
  }
})

export const removeItemFromArrayById = (arr, id) => arr.filter((el) => el.id !== id)
export const isItNotLastOrOnlyElementInArray = (order, length) => (order !== length) && ( length !== 1)

export const sortedArdReorderedArray = (array, deleteById, order) => {
  // delete element from array
  const deletedItemArray = removeItemFromArrayById(array, deleteById)
  let updatedArray;
  // reorder and sort array if the deleted item not the last one and not the only one
  const needToSortAdnReorder = isItNotLastOrOnlyElementInArray(order, array.length)
  if (needToSortAdnReorder) {
    const reordered = deletedItemArray.map((el) => {
      if (el.order > order) el.order = el.order - 1
      return el
    })
    updatedArray = sortedByOrder(reordered)
  } else updatedArray = deletedItemArray
  return updatedArray
}

export const updateTasksInCardsArray = (state, updatedTasksArray, fromCardId, toCardId, fromCardTasks, taskId, order) => {
  return state.map((card) => {
    if (card.id === fromCardId) card.tasks = sortedArdReorderedArray(fromCardTasks, taskId, order)
    if (card.id === toCardId) card.tasks = sortedByOrder(updatedTasksArray)
    return card
  })
}
