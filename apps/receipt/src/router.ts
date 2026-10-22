import { useEffect, useState } from 'react'

// Hash routes so every screen and state has a URL:
//   #/  #/deck/:id  #/browse  #/browse/:id  #/stats  #/settings  #/system
// Overlays sit on top of the last base route:
//   #/study/:deck  #/study/done  #/import  #/import?error  #/edit/:id
export type Route = { path: string[]; query: URLSearchParams }

const read = (): Route => {
  const [path, query = ''] = location.hash.replace(/^#\/?/, '').split('?')
  return {
    path: path.split('/').filter(Boolean).map(decodeURIComponent),
    query: new URLSearchParams(query),
  }
}

export function useRoute() {
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => setRoute(read())
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return route
}

export const go = (to: string) => {
  location.hash = to
}

export const overlays = new Set(['study', 'import', 'edit'])
