/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-04-14 11:21:23
 * @LastEditTime: 2022-05-20 14:11:29
 * @LastEditors: lanchao
 * @Reference:
 */
interface Config {
  url: string
}
const config: Config = {
  url: ''
}
if (process.env.NODE_ENV === 'production') {
  config.url = 'http://127.0.0.1'
} else {
  config.url = 'http://127.0.0.1'
}
export default config
