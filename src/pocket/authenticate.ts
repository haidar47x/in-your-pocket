import PocketAuthenticator from '../config/PocketAuthenticator'
import credientials from '../config/Credentials'
import { setLocalStorageItem } from '../storage/local_storage'

async function authenticateUser(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const authenticator = new PocketAuthenticator(credientials)
    authenticator
      .authenticate()
      .then(pocketToken => {
        console.log(pocketToken, 'acquired...')
        setLocalStorageItem({ pocketToken })
          .then(() => {
            resolve(pocketToken ? true : false)
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

async function logout(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.clear(() => {
      window.close()
      resolve(true)
    })
  })
}

export { authenticateUser, isAuthenticated, logout }
