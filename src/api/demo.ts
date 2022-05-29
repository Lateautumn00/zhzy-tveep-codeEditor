import request from '@/plugins/request'
import config from '@/config/index'
export const getList = (params: any) =>
  request({
    url: `${config.url}/sys/getTime`,
    method: 'get',
    params
  })
export const create = (data: any) =>
  request({
    url: `${config.url}/sys/getTime`,
    method: 'post',
    data
  })
