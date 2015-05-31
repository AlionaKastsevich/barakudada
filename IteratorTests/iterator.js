function Iterator(array, config) {
  this.circles = false;
  this.array = [];
  if (array) {
    if (Object.prototype.toString.call(array) === '[object Array]') {
      this.array = array;
    }
  }
  (this.array.length > 0) ? this.windowSize = 1 : this.windowSize = 0;
  this.index = 0;
  if (config) {
    if (typeof config.circles === 'boolean') {
      this.circles = config.circles;
    }
    if (isValidNumber(config.windowSize)) {
      this.windowSize = Math.max(0, config.windowSize);
    }
    if (isValidNumber(config.index)) {
      this.index = config.index;
    }
  }
  Object.observe(this.array, observer.bind(this));

  function observer(changes) {
    if (!this.circles) {
      this.index = Math.min(this.index, this.array.length - 1);
    }
  }
}

function isValidNumber(num) {
  return isValidNumberCirclic(num) && num >= 0;
}

function isValidNumberCirclic(num) {
  return typeof num === 'number' && (num ^ 0) === num;
}

function hasNext(num) {
  return this.index + num + this.windowSize <= this.array.length;
}

Iterator.prototype = {
  append: function(val) {
    this.array.push(val);
  },
  remove: function(pos, num) {
    if (isValidNumber(pos) && (pos + num) <= this.array.length) {
      this.array.splice(pos, num);
    } else throw new Error("position is out of range or number of values is too big");
  },
  insert: function(pos) {
    if (isValidNumber(pos) && pos <= this.array.length) {
      [].slice.call(arguments, 1).reverse()
        .forEach(function(x) {
            this.array.splice(pos, 0, x);
          }
          .bind(this));
    } else throw new Error("position is out of range");
  },
  current: function() {
    var lastElement = this.index + Math.min(this.windowSize, this.array.length);
    if (!this.circles) {
      return this.array.slice(this.index, lastElement);
    } else {
      if (lastElement > this.array.length) {
        return this.array.slice(this.index)
          .concat(this.array.slice(0, lastElement - this.array.length));
      } else {
        return this.array.slice(this.index, lastElement);
      }
    }
  },
  move: function(n, direction) {
    if (n === 0) return this.current();
    if (typeof n === 'function') {
      var res = n(this.index, this.windowSize);
      if (!this.circles && (res.x > this.array.length - 1 || !isValidNumber(res.x) || !isValidNumber(res.y))) {
        throw new Error("invalid input values or index is out of range");
      }
      if (this.circles && (!isValidNumberCirclic(res.x) || !isValidNumberCirclic(res.y))) {
        throw new Error("invalid input values or index is out of range");
      }
      this.windowSize = Math.max(0, res.y);
      this.index = res.x;
      n = 0;
    } else {
      n = n || 1;
      if (!isValidNumber(n)) {
        throw new Error("invalid input values or index is out of range");
      }
      if (direction === 'backward') n *= -1;
    }
    if (!this.circles) {
      if (this.index + n + this.windowSize > this.array.length) {
        throw new Error("the rest of data's length is less than your step");
      }
      if (this.index + n < 0) {
        throw new Error("you've reached the 0 index of the Array");
      }
      this.index = this.index + n;
    } else {
      this.index = (this.index + n) % this.array.length;
      if (this.index < 0) {
        this.index = this.array.length + this.index;
      }
    }
    return this.current();
  },
  backward: function(n) {
    if (n < 0) throw new Error('move forward with the help of forward function');
    return this.move(n, 'backward');
  },
  forward: function(n) {
    if (n < 0) throw new Error('move backward with the help of backward function');
    return this.move(n, 'forward');
  },
  jumpTo: function(i) {
    if (i < this.array.length && isValidNumber(i)) {
      this.index = i;
    } else throw new Error("Index is out of range or not a valid number");
  }
}