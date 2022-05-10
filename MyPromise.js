const STATE = {
  FULLFILLED: "fulfilled",
  REJECTED: "rejected",
  PENDING: "pending",
};

class MyPromise {
  #thenCallbacks = [];
  #catchCallbacks = [];
  #state = STATE.PENDING;
  #value;

  constructor(callback) {
    try {
      callback(this.#onSuccess, this.#onFail);
    } catch (error) {
      this.#onFail(error);
    }
  }

  #runCallbacks() {
    if (this.#state === STATE.FULLFILLED) {
      this.#thenCallbacks.forEach((callback) => {
        callback(this.#value);
      });
      this.#thenCallbacks = [];
    }

    if (this.#state === STATE.REJECTED) {
      this.#catchCallbacks.forEach((callback) => {
        callback(this.#value);
      });
      this.#catchCallbacks = [];
    }
  }

  #onSuccess(value) {
    if (this.#state !== STATE.PENDING) {
      return;
    }

    this.#value = value;
    this.#state = STATE.FULLFILLED;
    this.#runCallbacks();
  }

  #onFail(value) {
    if (this.#state !== STATE.PENDING) {
      return;
    }

    this.#value = value;
    this.#state = STATE.REJECTED;
    this.#runCallbacks();
  }

  then(thenCallback, catchCallback) {
    if (thenCallback) {
      this.#thenCallbacks.push(thenCallback);
    }
    if (catchCallback) {
      this.#catchCallbacks.push(catchCallback);
    }
    this.#runCallbacks();
  }

  catch(callback) {
    this.then(null, callback);
  }

  finally(callback) {
    throw new Error("Method not implemented");
  }
}

module.exports = MyPromise;
