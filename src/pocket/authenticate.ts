import PocketAuthenticator from '../config/PocketAuthenticator'
import credientials from '../config/api_config'
import {
  setLocalStorageItem,
  getLocalStorageItem,
  clearLocalStorage,
} from '../storage/local_storage'

async function authenticateUser(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const authenticator = new PocketAuthenticator(credientials)
    authenticator
      .authenticate()
      .then(pocketToken => {
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
    getLocalStorageItem('pocketToken')
      .then(token => {
        if (!token) {
          resolve(false)
        }
        resolve(true)
      })
      .catch(err => reject(err))
  })
}

async function logout(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    clearLocalStorage()
      .then(() => {
        window.close()
        resolve(true)
      })
      .catch(err => reject(err))
  })
}

export { authenticateUser, isAuthenticated, logout }
