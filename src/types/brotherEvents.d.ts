/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-06-07 20:28:24
 * @LastEditTime: 2022-06-07 21:03:13
 * @LastEditors: lanchao
 * @Reference:
 */
interface EventsBrother {
  tabsValue: string
  // eslint-disable-next-line no-undef
  tabs: TreeList[]
}
//左侧通知右侧
interface LeftBrotherEvents {
  name: string
  value: any
}
//右侧通知左侧
interface RightBrotherEvents {
  name: string
  value: any
}
