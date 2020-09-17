import request from '../config/http/http'
import getToken from './token'

interface RetrieveOptions {
  state?: string
  favorite?: boolean
  contentType?: string
  sort?: string
  detailType?: string
  search?: string
  domain?: string
  since?: number
  count?: number
  offset?: number
}

async function retrieve(opts: RetrieveOptions = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    getToken()
      .then(({ access_token, consumer_key }) => {
        request('v3/get', { ...opts, access_token, consumer_key })
          .then(response => {
            resolve(response)
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

export default retrieve
