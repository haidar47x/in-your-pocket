import * as $ from 'jquery'
import { createList, addItemToPocket } from './ui'

import { isAuthenticated, authenticateUser } from './pocket'

import {
  getLocalStorageItem,
  syncLocalwithPocket,
} from './storage/local_storage'

async function setupInterface(): Promise<void> {
  $('#login-btn').remove()
  $('.loader').show()
  getLocalStorageItem('pocketItems')
    .then(itemsJson => {
      if (itemsJson) createList(JSON.parse(itemsJson))
    })
    .catch(err => {
      console.log(err)
    })
    .then(async () => {
      $('.loader').hide()
      $('.container').show()
      await syncLocalwithPocket()
    })
}

document.addEventListener('DOMContentLoaded', async () => {
  $('.container').hide()
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    $('#login-btn').on('click', function () {
      $(this).text('Authenticating...').attr('disabled', 'disabled')
      authenticateUser()
        .then(done => {
          if (done) setupInterface()
        })
        .catch(err => {
          console.log(err)
        })
    })
  } else {
    setupInterface()
  }

  $('#add-icon').on('click', async () => {
    addItemToPocket()
  })
})
