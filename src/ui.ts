import * as $ from 'jquery'
import { modify, add } from './pocket'
import { ModifyActions } from './pocket/actions'
import { syncLocalwithPocket } from './storage/local_storage'

function createListItem(item: any): any {
  const deleteIcon = $(
    `<div class="delete-icon"><img src="./icons/delete48.png" width="20px" /></div>`
  ).on('click', function () {
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
  })

  const titleText =
    item.given_title.trim() ||
    item.resolved_title.trim() ||
    item.given_url.trim() ||
    item.resolved_url.trim()

  const title = $(`<div class="title">${titleText}</div>`)
  const listItem = $(`<div class="list-item" id="${item.item_id}"></div>`)

  $(listItem)
    .append(title)
    .append(deleteIcon)
    .on('click', function () {
      chrome.tabs.create({ url: item.given_url, active: false })
    })

  return $(listItem)
}

function createList(items: any): void {
  console.log(items)
  $('.list').empty()
  items.forEach(item => {
    const itemElem = createListItem(item)
    $('.list').append(itemElem)
  })
}

async function addItemToPocket(): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true }, tabs => {
      let activeTab = tabs[0]
      add({ url: activeTab.url })
        .then(async response => {
          syncLocalwithPocket()
            .then(itemsArr => {
              resolve()
            })
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  })
}

export { createList, addItemToPocket }
