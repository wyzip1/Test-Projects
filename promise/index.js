const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class promise {
  #status = PENDING
  #value = null
  #reason = null
  #onFulfilledList = []
  #onRejectedList = []

  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise executor ${executor} is not a function`)
    }
    const _resolve = (value) => {
      this.#status = FULFILLED
      this.#value = value
      this.#onRejectedList.length = 0

      queueMicrotask(() => {
        while (this.#onFulfilledList.length) {
          this.#onFulfilledList.shift()()
        }
      })
    }
    const reject = (reason) => {
      if (this.#status !== PENDING) return
      this.#status = REJECTED
      this.#reason = reason
      this.#onFulfilledList.length = 0

      queueMicrotask(() => {
        while (this.#onRejectedList.length) {
          this.#onRejectedList.shift()()
        }
      })
    }

    const resolve = (value) => {
      if (this.#status !== PENDING) return

      if (value === this) return reject(new TypeError('Chaining cycle detected for promise'))

      if ((value !== null && typeof value === 'object') || typeof value === 'function') {

        let then
        try {
          then = value.then // 如果 then 是 getter 可能会抛异常
        } catch (err) {
          reject(err)
          return
        }

        if (typeof then !== 'function') return _resolve(value)
          

        let called = false
        try {
          then.call(value, v => {
            if (called) return
            called = true
            resolve(v)
          }, e => {
            if (called) return
            called = true
            reject(e)
          })
        } catch (err) {
          if (called) return
          reject(err)
        }

      } else {
        _resolve(value)
      }
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onfulfilled, onrejected) {
    return new promise((resolve, reject) => {
      const onSuccess = () => {
        try {
          typeof onfulfilled === 'function' ? resolve(onfulfilled(this.#value)) : resolve(this.#value)
        } catch (err) {
          reject(err)
        }
      }
      const onFail = () => {
        try {
          typeof onrejected === 'function' ? resolve(onrejected(this.#reason)) : reject(this.#reason)
        } catch (err) {
          reject(err)
        }
      }

      if (this.#status === FULFILLED) {
        queueMicrotask(onSuccess)
      } else if (this.#status === REJECTED) {
        queueMicrotask(onFail)
      } else if (this.#status === PENDING) {
        this.#onFulfilledList.push(() => queueMicrotask(onSuccess))
        this.#onRejectedList.push(() => queueMicrotask(onFail))
      }
    })
  }

  static resolve(value) {
    return new promise(resolve => resolve(value))
  }
}

promise.deferred = function () {
  var result = {};
  result.promise = new promise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}
module.exports = promise;