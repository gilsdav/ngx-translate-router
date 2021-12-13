/**
 * Compare if two objects are same
 */
export function equals(o1: any, o2: any): boolean {
  if (o1 === o2) {
    return true;
  }
  if (o1 === null || o2 === null) {
    return false;
  }
  if (o1 !== o1 && o2 !== o2) {
    return true; // NaN === NaN
  }
  const t1 = typeof o1,
    t2 = typeof o2;
  let length: number,
    key: any,
    keySet: any;

  if (t1 === t2 && t1 === 'object') {
    if (Array.isArray(o1)) {
      if (!Array.isArray(o2)) {
        return false;
      }
      if ((length = o1.length) === o2.length) {
        for (key = 0; key < length; key++) {
          if (!equals(o1[key], o2[key])) {
            return false;
          }
        }
        return true;
      }
    } else {
      if (Array.isArray(o2)) {
        return false;
      }
      keySet = Object.create(null);
      for (key in o1) {
        if (o1.hasOwnProperty(key)) {
          if (!equals(o1[key], o2[key])) {
            return false;
          }
          keySet[key] = true;
        }
      }
      for (key in o2) {
        if (o2.hasOwnProperty(key)) {
          if (!(key in keySet) && typeof o2[key] !== 'undefined') {
            return false;
          }
        }
      }
      return true;
    }
  }
  return false;
}

/**
 * Determine if the argument is shaped like a Promise
 */
export function isPromise(obj: any): obj is Promise<any> {
  // allow any Promise/A+ compliant thenable.
  // It's up to the caller to ensure that obj.then conforms to the spec
  return !!obj && typeof obj.then === 'function';
}

/**
 * Deep copy of object and array
 */
export function deepCopy<t>(object: t): t {
  const output = Array.isArray(object) ? [] : {};
  for (const data in object) {
    if (data) {
      const value = object[data];
      output[data as string] = (typeof value === 'object') ? deepCopy(value) : value;
    }
  }
  return output as t;
}

export function flatten<T>(list: Array<T|T[]>): T[] {
  return list.reduce((flat: any[], item: T|T[]): T[] => {
    const flatItem = Array.isArray(item) ? flatten(item) : item;
    return (<T[]>flat).concat(flatItem);
  }, []);
}
