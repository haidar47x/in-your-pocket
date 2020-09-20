import * as $ from 'jquery'
import { modify, add } from './pocket'
import { ModifyActions } from './pocket/actions'
import {
  syncLocalwithPocket,
  getLocalStorageItem,
} from './storage/local_storage'
import { itemsToArray } from './utils'

function createListItem(item: any): any {
  const deleteIcon = $(`<span class="delete-icon hide">✖</span>`).on(
    'click',
    function (event) {
      event.stopPropagation()
      modify({
        actions: [
          {
            action: ModifyActions.Delete,
            item_id: item.item_id,
          },
        ],
      }).then(async res => {
        $(`.list #${item.item_id}`).remove()
        await syncLocalwithPocket()
      })
    }
  )

  /** const itemControls = $('<div class="item-controls"></div>').append(deleteIcon) **/

  let logoSrc
  if (item.domain_metadata && item.domain_metadata.logo) {
    logoSrc = item.domain_metadata.logo
  } else {
    logoSrc = './assets/icons/globe.svg'
  }

  const titleText =
    item.given_title.trim() ||
    item.resolved_title.trim() ||
    item.given_url.trim() ||
    item.resolved_url.trim()

  const url = item.resolved_url || item.given_url

  const titleDiv = $(`
      <div class="title truncate">
        <img src="${logoSrc}" class="logo" width="13px" />${titleText}
      </div>`)

  const urlDiv = $(`
      <div class="url truncate">
        <a href="${url}">${url}</a>
      </div>
  `)

  urlDiv.prepend(deleteIcon)

  const listItem = $(`<div class="list-item" id="${item.item_id}"></div>`)

  $(listItem)
    .append(titleDiv)
    .append(urlDiv)
    .on('click', function () {
      chrome.tabs.create({ url: item.given_url, active: false })
    })

  return $(listItem)
}

function createList(items: any): void {
  $('.list').empty()

  if (!items || items.length === 0) {
    $(`<div class="no-items"></div>`)
      .text('No items in pocket... yet!')
      .appendTo('.list')
    $('#search-input').attr('disabled', 'disabled')
    return;
  }

  items.forEach(item => {
    const itemElem = createListItem(item)
    $('.list').append(itemElem)
  })

}

async function addItemToPocket(): Promise<any> {
  $('.add-icon').addClass('is-loading')
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true }, tabs => {
      let activeTab = tabs[0]
      add({ url: activeTab.url, title: activeTab.title.trim() })
        .then(async response => {
          syncLocalwithPocket()
            .then(itemsArr => {
              $('.add-icon').removeClass('is-loading')
              resolve()
            })
            .catch(err => {
              $('.add-icon').removeClass('is-loading')
              reject(err)
            })
        })
        .catch(err => {
          $('.add-icon').removeClass('is-loading')
          reject(err)
        })
    })
  })
}

async function openRandomItem(): Promise<void> {
  return new Promise((resolve, reject) => {
    getLocalStorageItem('pocketItems')
      .then(pocketItems => {
        if (!pocketItems) {
          resolve()
        }
        let parsed = JSON.parse(pocketItems)
        let randIdx = Math.floor(Math.random() * parsed.length)
        chrome.tabs.create(
          { url: parsed[randIdx].given_url, active: false },
          () => {
            resolve()
          }
        )
      })
      .catch(err => reject(err))
  })
}

async function searchList(keywords: string): Promise<void> {
  const items = await getLocalStorageItem('pocketItems')
  const parsedItems = JSON.parse(items)
  keywords = keywords.toLowerCase()
  let searchedItems = []
  for (let i = 0; i < parsedItems.length; i++) {
    if (
      parsedItems[i].given_title.toLowerCase().includes(keywords) ||
      parsedItems[i].resolved_title.toLowerCase().includes(keywords) ||
      parsedItems[i].given_url.toLowerCase().includes(keywords) ||
      parsedItems[i].resolved_url.toLowerCase().includes(keywords)
    ) {
      searchedItems.push(parsedItems[i])
    }
  }

  $('.list-msg').show().text(`${searchedItems.length} results found`)
  createList(searchedItems)
  if (keywords.length === 0) {
    $('.list-msg').hide()
  }
}

function makeToast(msg: string): void {
  $('.toast .msg').text(msg.trim())
  $('.toast').show()
  setTimeout(() => {
    $('.toast').slideUp()
  }, 2000)
}

export { createList, addItemToPocket, openRandomItem, makeToast, searchList }
