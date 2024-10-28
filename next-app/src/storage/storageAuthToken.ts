import { destroyCookie, parseCookies, setCookie, } from 'nookies';

export async function storageAuthTokenSave(token: string) {
  setCookie(undefined, '@desafio:token', token, {
    maxAge: 60 * 60 * 24 * 30,
    path: '/'
  })
}

export async function storageAuthTokenGet() {
  const cookies = parseCookies();
  return cookies['@desafio:token'];
}

export async function storageAuthTokenRemove() {
  destroyCookie(undefined, "@desafio:token");
}
