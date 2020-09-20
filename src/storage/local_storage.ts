import * as $ from 'jquery'
import { retrieve } from '../pocket'
import { itemsToArray } from '../utils'
import { createList } from '../ui'

async function getLocalStorageItem(item: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(item, items => {
      resolve(items[item])
    })
  })
}

async function getLocalStorageItems(): Promise<{ [key: string]: [] }> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(items => {
      resolve(items)
    })
  })
}

async function setLocalStorageItem(items: any): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(items, () => {
      resolve()
    })
  })
}

async function removeLocalStorageItem(item: any): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(item, () => {
      resolve(true)
    })
  })
}

async function syncLocalwithPocket(): Promise<any> {
  $('.refresh-icon').addClass('is-loading')
  return new Promise((resolve, reject) => {
    retrieve({ state: 'all' })
      .then(async ({ list: items }) => {
        await removeLocalStorageItem('pocketItems')
        let itemsArr = itemsToArray(items, 'time_added')
        setLocalStorageItem({
          pocketItems: JSON.stringify(itemsArr),
        })
          .then(() => {
            createList(itemsArr)
            $('.refresh-icon').removeClass('is-loading')
            resolve(itemsArr)
          })
          .catch(err => reject(err))
      })
      .catch(err => {
        reject(err)
      })
  })
}

async function clearLocalStorage(): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.clear(() => {
      resolve()
    })
  })
}

export {
  getLocalStorageItem,
  getLocalStorageItems,
  setLocalStorageItem,
  syncLocalwithPocket,
  clearLocalStorage,
}
