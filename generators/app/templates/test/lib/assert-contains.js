const assert = require('assert');


const isObject = (obj) => obj && typeof obj === 'object';

const trimObject = (obj, pattern) => {
  if (!isObject(obj) || !isObject(pattern)) {
    return;
  }

  for (const prop in obj) {
    if (isObject(obj[prop]) && isObject(pattern[prop])) {
      trimObject(obj[prop], pattern[prop]);
      continue;
    }

    if (pattern[prop] === undefined) {
      delete obj[prop];
    }
  }
};

const fail = (obj, pattern, message) => {
  trimObject(obj, pattern);
  assert.fail(obj, pattern, message, '∈', assertContains); // eslint-disable-line
};

const contains = (obj, pattern) => {
  if (!isObject(obj) || !isObject(pattern)) {
    return obj === pattern;
  }

  if (typeof obj.length === 'number' && typeof pattern.length === 'number') {
    for (let i = 0; i < pattern.length; i += 1) {
      let isPresent = false;
      for (let j = 0; j < obj.length; j += 1) {
        if (contains(obj[j], pattern[i])) {
          isPresent = true;
          break;
        }
      }
      if (!isPresent) { return false; }
    }
    return true;
  }

  for (const prop in pattern) {
    if (pattern[prop] !== undefined && !contains(obj[prop], pattern[prop])) {
      return false;
    }
  }

  return true;
};

const assertContains = (obj, pattern, message) => {
  if (!isObject(obj) || !isObject(pattern)) {
    throw new Error('Both obj and pattern must be an object or an array.');
  }
  if (!contains(obj, pattern)) {
    return fail(obj, pattern, message);
  }
};


module.exports = assertContains;
