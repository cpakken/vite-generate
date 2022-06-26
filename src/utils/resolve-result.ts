function isPromiseLike<T>(thing: T): thing is Extract<T, PromiseLike<any>> {
  return thing && typeof (thing as any).then === 'function'
}

export async function resolveResult<T>(result: T | (() => T | Promise<T>)) {
  if (result instanceof Function) {
    const resolved = result()
    return isPromiseLike(resolved) ? await resolved : resolved
  } else {
    return result
  }
}
//Apply formating / output raw etc / json5 / superjson / custom format function
export function serializeResult(resolved: any, _options?: any) {
  //serialize only if object
  if (resolved !== null && typeof resolved === 'object') {
    //since tyepof null is object
    return JSON.stringify(resolved)
  }
  return resolved
}
