import request from '../config/http/http'
import getToken from './token'

interface AddOptions {
  url?: string,
  title?: string,
  tags?: string,
  tweet_id?: string
}

async function add(opts: AddOptions = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    getToken()
      .then(({ access_token, consumer_key }) => {
        request('v3/add', { ...opts, access_token, consumer_key })
          .then(response => {
            if (response.status > 0) {
              resolve(response.item)
            }
            reject(new Error("Item didn't save successfully"))
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

export default add
