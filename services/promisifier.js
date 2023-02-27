const promisifier = fn => (...args) =>
    Promise.resolve(fn(...args))

module.exports = promisifier