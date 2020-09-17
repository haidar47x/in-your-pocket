import { getLocalStorageItem } from '../storage/local_storage'
import credentials from '../config/Credentials'

async function getToken(): Promise<{ access_token: string, consumer_key: string}> {
  return new Promise((resolve, reject) => {
    getLocalStorageItem('pocketToken')
      .then(access_token => {
        console.log('Token retrieved', access_token)
        const { consumer_key } = credentials
        resolve({ access_token, consumer_key })
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default getToken
