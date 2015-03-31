function DoubleLinkedList() {
    this._head = null;
    this._tail = null;
    this._length = 0;
}

DoubleLinkedList.prototype = {

    createNode: function (value) {
        var node = {
            value : value,
            next : null,
            prev : null
        };
        return node;
    },

    append: function (value) {
        var node = this.createNode(value);
        if (this.isEmpty()) {
            this._head = node;
            this._tail = node;
        } else {
            this._tail.next = node;
            node.prev = this._tail;
            this._tail = node;
        }
        this._length++;
        return this;
    },

    head: function () {
        if (this.isEmpty()) {
            throw new Error("List is  empty");
        }
        return this._head;
    }, 

    tail: function () {
        if (this.isEmpty()) {
            throw new Error("List is  empty");
        }  
        return this._tail;
    },

    isEmpty:  function () {
        return this._length === 0;
    },

    reverse: function () {
        var current= this._head,
            tmp;
        this._tail = this._head;
        while (current) {
            tmp = current.next;
            current.next = current.prev;
            current.prev = tmp;
            if (!tmp) {
                this._head = current;
            } 
            current = tmp;
            };
        return this;
    },

    at: function (index) {
        var i=0;
        if (this.indexIsValid(index)) {
          var current = this._head;
          while(i !== index) {
            current = current.next;
            i++;
          }
        return current;
        }
        throw new Error("Index is out of range");
    },

    indexOF: function (value) {
        var i = 0;
        current=this._head;
        while(i < this._length) {
          if (current.value === value){
            return i;
          }
          current = current.next;
          i++;
        }
        throw new Error ("Such value doesn't exist");
    },

    insertAt: function(index, value) {
      	if (index === this._length) {
          this.append(value);
          return this;
        };
        if (!this.indexIsValid(index))
          throw new Error("Index is out of range");

        var current = this.createNode(value);
        this._tail.next = current;
        current.prev = this._tail;
        this._tail = current;
        var i = this._length;
        current = this._tail;

        while (i !== index) {
          current.value = current.prev.value;
          current = current.prev;
          i--;
        };
        current.value = value;
        this._length++;
        return this;
    },

    toArray: function () {
        var result = [],
            current = this._head;
        while (current) {
          result.push(current.value);
          current = current.next;
        }
        return result;
    },

    toString: function () {
        return this.toArray().toString();
    },

    indexIsValid: function(index) {
        return index >= 0&&index < this._length;
    },

    deleteAt: function (index) {
        if (!this.indexIsValid(index))
        	throw new Error("Index is out of range");
        var current = this._head,
                  i = 0;
        if (index === 0) {
            this._head = current.next;
            !this._head?this._tail = null:this._head.prev = null;
        } else if (index === this._length-1) {
            current = this._tail;
            this._tail = current.prev;
            this._tail.next = null;
        } else {
            while (i++ < index) {
              current = current.next;
            }
            current.prev.next = current.next;
        }
        this._length--;
        return this;
    },

    deleteVal: function (value) {
        var indexOF = this.indexOF(value);
        this.deleteAt(indexOF);
      	return this;
    },

    each: function (callback) {
          if (typeof callback !== "function") {
            throw new Error("Not a function");
          };
          for (var i = 0; i < this._length; i++) {
            var current=this.at(i);
            current.value = callback(current.value);
          };
          return this;
    },
};