import headers from './headers'
import HTTPMethods from './http_methods'

const baseUrl = 'https://getpocket.com/'

function request(
  url: string,
  body: any,
  method: HTTPMethods = HTTPMethods.POST,
): Promise<any> {
  return new Promise((resolve, reject) => {
    fetch(baseUrl + url, {
      body: JSON.stringify(body),
      method,
      headers,
    })
      .then(response => {
        return response.json()
      })
      .then(json => {
        resolve(json)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default request
