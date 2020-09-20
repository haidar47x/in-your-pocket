import * as $ from 'jquery'
import { createList, addItemToPocket, openRandomItem, makeToast, searchList } from './ui'
import { isAuthenticated, authenticateUser } from './pocket'

import {
  clearLocalStorage,
  getLocalStorageItem,
  syncLocalwithPocket,
} from './storage/local_storage'

async function setupInterface(): Promise<void> {
  $('.login-container').remove()
  $('.toast').hide()
  $('.list-msg').hide()

  chrome.tabs.query({ active: true }, tabs => {
    $('.page-title').text(tabs[0].title)
  })

  $('.add-icon').on('click', async () => {
    try {
      await addItemToPocket()
    } catch (e) {
      console.log(e)
      makeToast('Something went wrong, try again!')
    }
  })

  $('.random-icon').on('click', async () => {
    try {
      await openRandomItem()
    } catch (e) {
      console.log(e)
      makeToast('Something went wrong, try again!')
    }
  })

  $('.refresh-icon').on('click', async () => {
    try {
      await syncLocalwithPocket()
    } catch (e) {
      console.log(e)
      makeToast('Something went wrong, try again!')
    }
  })


  $('#search-input').on('keyup', event => {
    searchList($(event.target).val().toString())
  })

  getLocalStorageItem('pocketItems')
    .then(itemsJson => {
      if (itemsJson) createList(JSON.parse(itemsJson))
    })
    .catch(err => {
      console.log(err)
      makeToast('Something went wrong, try again!')
    })
    .then(async () => {
      $('.login-container').hide()
      $('.disclaimer').hide()
      $('.container').show()
      await syncLocalwithPocket()
    })
}

document.addEventListener('DOMContentLoaded', async () => {
  $('.container').hide()
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    $('.login-btn').on('click', function () {
      $(this).text('Please wait...').attr('disabled', 'disabled')
      authenticateUser()
        .then(done => {
          if (done) setupInterface()
        })
        .catch(err => {
          console.log(err)
          makeToast('Something went wrong, try again!')
        })
    })
  } else {
    setupInterface()
  }
})
