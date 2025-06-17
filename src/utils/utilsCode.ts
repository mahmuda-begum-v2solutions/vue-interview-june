const CACHE_MAP = new Map<string, unknown>()
export async function apiCallFn<T>(url: string, transform?: (data: unknown) => T): Promise<T> {
  if (CACHE_MAP.has(url)) {
    return CACHE_MAP.get(url) as T
  }
  const apiRes = await fetch(url)
  if (!apiRes.ok) throw new Error(`api failed ${url}`)
  const raw = await apiRes.json()
  const isValid = Array.isArray(raw) ? raw.length > 0 : raw && typeof raw === 'object'
  if (!isValid) throw new Error('data not available')
  const data = transform ? transform(raw) : raw
  CACHE_MAP.set(url, data)
  return data
}
