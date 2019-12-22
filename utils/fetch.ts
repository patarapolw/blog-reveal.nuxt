import { URL } from './url'

export async function fetchOrLocal (url: string, h: string | null) {
  const u = new URL(url, typeof location === 'undefined' ? process.env.serverUrl : location.origin)
  if (h) {
    u.searchParams.set('h', h)
  }

  return await fetch(u.href).then(r => r.text())
}
