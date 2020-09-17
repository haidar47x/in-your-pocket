function itemsToArray(items: any, sortBy: string): any {
  let itemsArr = []
  for (let key in items) itemsArr.push(items[key])
  return itemsArr.sort((a, b) => b[sortBy] - a[sortBy])
}

export {
  itemsToArray
}
