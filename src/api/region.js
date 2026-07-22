import request from '@/utils/request'

export function getProvinces() {
  return request({ url: '/region/provinces', method: 'get' })
}

export function getCities(provinceCode) {
  return request({ url: '/region/cities', method: 'get', params: { provinceCode } })
}

export function getDistricts(cityCode) {
  return request({ url: '/region/districts', method: 'get', params: { cityCode } })
}

export function getTowns(districtCode) {
  return request({ url: '/region/towns', method: 'get', params: { districtCode } })
}
