import { add } from './pocket'
import { syncLocalwithPocket } from './storage/local_storage'

const id = 'iyp-7355608'

chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id,
    contexts: ['all'],
    title: 'Add to Pocket',
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== id) {
    return
  }

  const mediaType = ['video', 'image', 'audio']
  let url, title

  if (info.mediaType) {
    if (mediaType.indexOf(info.mediaType.toLowerCase()) > -1) {
      url = info.srcUrl
    }
    title = null
  } else if (info.linkUrl) {
    url = info.linkUrl
    title = null
  } else {
    url = tab.url
    title = tab.title
  }

  await add({ url, title })
  await syncLocalwithPocket()
})
