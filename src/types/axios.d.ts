import * as axios from 'axios'
//解决 Property '***' does not exist on type ‘AxiosResponse＜any＞‘.Vetur(2339)
declare module 'axios' {
  interface AxiosInstance {
    (config: AxiosRequestConfig): Promise<any>
  }
}
