import request from '../config/http/http'
import getToken from './token'

import { ModifyOptions } from './actions'

async function modify(opts: ModifyOptions): Promise<any> {
  return new Promise((resolve, reject) => {
    getToken()
      .then(({ access_token, consumer_key }) => {
        request('v3/send', { ...opts, access_token, consumer_key })
          .then(response => {
            if (response.status > 0) {
              resolve(response)
            }
            reject(new Error("Your changes wasn't saved"))
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

export default modify
