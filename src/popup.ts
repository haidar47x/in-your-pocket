import credientials from './config/Credentials'
import PocketAuthenticator from './config/PocketAuthenticator'
import request from './config/http/http'
import HTTPMethods from './config/http/http_methods'

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

async function setLocalStorageItems(items: any): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(items, () => {
      resolve()
    })
  })
}

function clearLocalStorage(): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.clear(() => {
      resolve()
    })
  })
}

function listLocalStorage(): void {
  chrome.storage.local.get(items => {
    console.log(items)
  })
}

async function isAuthenticated(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('pocketToken', items => {
      console.log(items)
      if (!items.pocketToken) {
        resolve(false)
      }
      resolve(true)
    })
  })
}

async function authenticateUser(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const authenticator = new PocketAuthenticator(credientials)
    authenticator
      .authenticate()
      .then(pocketToken => {
        console.log('Saving', pocketToken)
        setLocalStorageItem({ pocketToken })
          .then(() => {
            resolve(true)
          })
          .catch(err => {
            reject(err)
          })
      })
      .catch(err => {
        reject(err)
      })
  })
}

function applyClassToEl(el: string, _class: string): void {
  document.querySelectorAll(el).forEach(e => e.classList.add(_class))
}

function removeClassFromEl(el: string, _class: string): void {
  document.querySelectorAll(el).forEach(e => e.classList.remove(_class))
}

function removeDomElement(el: string): void {
  document.querySelector(el).remove()
}

function removeAllDomElement(el: string): void {
  document.querySelectorAll(el).forEach(e => e.remove())
}

async function setupInterface() {
  console.log('Setting up interface...')
  removeDomElement('#login-btn')
  removeClassFromEl('.container', 'hide')
  const { list } = await request('v3/get', {
    consumer_key: credientials.consumer_key,
    access_token: await getLocalStorageItem('pocketToken'),
  })
  const container = document.querySelector('.container')
  for (var key in list) {
    const anchor = `<a href="${list[key].given_url}">${list[key].given_title}</a>`
    const div = document.createElement('div')
    div.innerHTML = anchor
    container.appendChild(div)
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Executed...')
  await clearLocalStorage()
  const isAuth = await isAuthenticated()
  if (!isAuth) {
    console.log('Is not authenticated...')
    document.querySelector('#login-btn').addEventListener(
      'click',
      () => {
        console.log('Authenticating user...')
        authenticateUser()
          .then(done => {
            if (done) setupInterface()
          })
          .catch(err => {
            console.log(err)
          })
      },
      false
    )
  } else {
    console.log('User already authenticated...')
    setupInterface()
  }
})
