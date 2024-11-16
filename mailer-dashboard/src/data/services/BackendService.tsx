import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

class BackendService {
  protected api: AxiosInstance

  constructor(private endpoint: string) {
    this.api = axios.create({
      baseURL: this.endpoint,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.configure()
  }

  private configure() {
    /*const auth = getAuthSession()

    if (auth && auth.token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`
    }*/
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config)
    return response.data
  }

  async download(url: string, config?: AxiosRequestConfig) {
    const response = await this.api.get(url, {
      ...config,
      responseType: 'blob',
    })

    return response.data
  }
}

export default BackendService
