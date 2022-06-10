/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-06-07 20:28:24
 * @LastEditTime: 2022-06-07 21:03:13
 * @LastEditors: lanchao
 * @Reference:
 */
import { TreeList } from '@/types/tree'
export interface EventsBrother {
  tabsValue: string
  tabs: TreeList[]
}
//左侧通知右侧
export interface LeftBrotherEvents {
  name: string
  value: any
}
//右侧通知左侧
export interface RightBrotherEvents {
  name: string
  value: any
}
