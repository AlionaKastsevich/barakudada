(function() {
  function $(selector) {
    if (!(this instanceof $)) {
      return new $(selector);
    }
    if (typeof selector === 'string') {
      return this.search(selector);
    }
    this[0] = selector;
    this.length = 1;
  }

  $.prototype = {
    constructor: $,
    length: 0,

    search: function(selector) {
      var that = this;
      var elems = Array.prototype.slice
        .call(document.querySelectorAll(selector));
      elems.forEach(function(x, i) {
        that[i] = x;
      });
      this.length = elems.length;
      return this;
    },

    addClass: function(newClass) {
      if (typeof newClass === 'function') {
        this.each(function(index) {
          var classToAdd = newClass(index, this.className);
          if (classToAdd) {
            this.classList.add(classToAdd);
          }
        });
      } else {
        newClass = newClass.split(' ');
        this.each(function() {
          for (var i = 0; i < newClass.length; i++) {
            if (!this.classList.contains(newClass[i].trim())) {
              !this.className ? this.className = newClass[i].trim() : this.className += ' ' + newClass[i].trim();
            }
          }
        });
      }
      return this;
    },

    append: function(val) {
      if (val instanceof $) {
        this[0].appendChild(val[0]);
        for (var i = 1; i < this.length; i++) {
          var p = val[0].cloneNode(true);
          this[i].appendChild(p);
        }
      } else Array.prototype.slice
        .call(this)
        .forEach(function(x) {
          x.innerHTML = x.innerHTML + val;
        });

      return this;
    },

    html: function(val) {
      if (typeof val === 'string') {
        this.each(function() {
          while (this.firstChild) {
            this.removeChild(this.firstChild);
          }
          this.innerHTML = val;
        });
        return this;
      }

      if (typeof val === 'function') {
        this.each(function(index) {
          while (this.firstChild) {
            this.removeChild(this.firstChild);
          }
          this.innerHTML = val(index);
        });
        return this;
      }

      if (arguments.length === 0) {
        return this[0].innerHTML;
      }
    },

    attr: function(attribute, value) {
      if (typeof attribute === 'string') {
        if (arguments.length === 2 &&
          typeof value === 'string' && value) {
          this.each(function() {
            this.setAttribute(attribute, value);
          });
          return this;
        }

        if (arguments.length === 2 && typeof value === 'function') {
          this.each(function(index) {
            var old = this.getAttribute(attribute);
            var newVal = value(index, old);
            if (newVal && old) {
              this.setAttribute(attribute, value(index, old));
            }
          });
        }
        return this[0].getAttribute(attribute)||this;
      }

      if (typeof attribute === 'object') {
        for (var key in attribute) {
          this.each(function() {
            this.setAttribute(key, attribute[key]);
          });
        }
        return this;
      }
    },

    children: function(selector) {
      var childs = [];
      this.each(function() {
        if (this) {
          for (var i = 0; i < this.children.length; i++) {
            childs.push(this.children[i]);
          }
        }
      });

      for (var key in Object.keys(this)) {
        delete this[key];
      }

      if (selector) {
        childs = childs.filter(function(x) {
          return x.matches(selector);
        });
      }

      for (var i = 0; i < childs.length; i++) {
        this[i] = childs[i];
      }

      this.length = childs.length;
      return this;
    },

    css: function(prop, val) {
      if (arguments.length === 1 && typeof prop === 'string') {
        if (this[0].hasAttribute('style')) {
          var computedStyle = getComputedStyle(this[0]);
          return computedStyle[prop];
        }
      }

      if (arguments.length === 1 && Array.isArray(prop)) {
        var result = [];
        var that = this;
        prop.forEach(function(x) {
          if (getComputedStyle(that[0])[x]) {
            result.push(x + " : " + getComputedStyle(that[0])[x]);
          }
        });
        return result;
      }

      if (arguments.length === 1 && {}.toString.call(prop) == "[object Object]") {
        this.each(function(index) {
          for (var i in prop) {
            if (typeof prop[i] === 'function') {
              prop[i] = prop[i](index, this.style[i]);
            }
            this.style[i] = prop[i];
          }
        });
      }

      if (arguments.length === 2 && typeof val === 'function') {
        this.each(function(index) {
          this.style[prop] = val(index, this.style[prop]);
        });
        return this;
      }

      if (arguments.length === 2 && typeof prop === 'string') {
        this.each(function() {
          this.style[prop] = val;
        });
        return this;
      }
      return this;
    },

    data: function(key, val) {
      if ((arguments.length === 1 && typeof key === "string") ||
        (arguments.length === 2 && (typeof key === "string" &&
          typeof val === "undefined"))) {
        try {
          return JSON.parse(this[0].dataset[key]);
        } catch (err) {
          return this[0].dataset[key];
        }
      }

      if (typeof key === "string" &&
        (typeof val === "string" || typeof val === "number")) {

        this.each(function() {
          this.dataset[key] = val;
        });
      }

      if (typeof key === 'object') {
        for (var k in key) {
          this[0].dataset[k] = JSON.stringify(key[k]);
        }
      }

      if (typeof val === 'object') {
        this[0].dataset[key] = JSON.stringify(val);
      }

      if (arguments.length === 0) {
        var obj = {};
        for (k in this[0].dataset) {
          try {
            obj[k] = JSON.parse(this[0].dataset[k]);
          } catch (err) {
            obj[k] = this[0].dataset[k];
          }
        }
        return obj;
      }
    },

    on: function(events, handler) {
      this.each(function() {
        this.addEventListener(events, handler);
      });
      return this;
    },

    one: function(event, handler) {

      this.each(function() {
        this.addEventListener(event, secondaryHandler);
      });

      function secondaryHandler(event) {
        handler.call(this, event);
        removeEvent(event.target);
      }

      function removeEvent(el) {
        el.removeEventListener(event, secondaryHandler);
      }

      return this;
    },

    each: function(callback, reciever) {
      for (var i = 0; i < this.length; i++) {
        callback.call(this[i], i);
      }
      return this;
    },

  };
  window.$ = $;
}());