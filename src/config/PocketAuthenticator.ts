import request from './http/http'
import PocketCredientials from './PocketCredentials'

interface IAuthFlowParams {
  code: string
  redirect_uri: string
}

class PocketAuthenticator {
  constructor(private readonly credentials: PocketCredientials) {
  }

  private getAuthUri({ code, redirect_uri }: IAuthFlowParams): string {
    let authUri = 'https://getpocket.com/auth/authorize?'
    return authUri + `request_token=${code}&redirect_uri=${redirect_uri}`
  }

  private launchWebAuthFlow(
    code: string
  ): Promise<{ responseUrl: string | null; code: string }> {
    return new Promise((resolve, reject) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: this.getAuthUri({
            code,
            redirect_uri: this.credentials.redirect_uri,
          }),
          interactive: true,
        },
        function (responseUrl: string) {
          resolve({ responseUrl, code })
        }
      )
    })
  }

  public authenticate(): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('Requesting v3/oauth/request...')
      request('v3/oauth/request', this.credentials)
        .then(response => {
          console.log('Launching OAuth flow...')
          return this.launchWebAuthFlow(response.code)
        })
        .then(response => {
          console.log('Acquiring access token...')
          request('v3/oauth/authorize', {
            consumer_key: this.credentials.consumer_key,
            code: response.code,
          })
            .then(tokenResponse => {
              console.log("Auth flow completed...")
              resolve(tokenResponse.access_token)
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
}

export default PocketAuthenticator
