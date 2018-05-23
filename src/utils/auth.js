/**
 * Created by admin on 2018/5/23.
 */
import Cookies from 'js-cookie'

export const TokenKey = 'Account-Token';


export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
