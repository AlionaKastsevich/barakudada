describe('Iterator', function() {
  var iterator;
  var arr = [];
  var config = {};

  beforeEach(function() {
    iterator = new Iterator([], {});
  });
  describe('iterator properties', function() {
    it('all the properties should be defined by default', function() {
      iterator = new Iterator();
      expect(iterator).to.have.all.keys('array', 'windowSize', 'index', 'circles');
      expect(iterator.array).to.be.ok;
      expect(iterator.windowSize).to.exist;
      expect(iterator.index).to.exist;
      expect(iterator.circles).to.exist;
    });
  });
  describe('should assign default values if input values are incorrect or undefined', function() {
    it('should assign an empty array by default', function() {
      iterator = new Iterator({}, {});
      expect(iterator.array).to.eql([]);
      iterator = new Iterator();
      expect(iterator.array).to.eql([]);
    });
    it('should assign 0 as index by default', function() {
      expect(iterator.index).to.equal(0);
      iterator = new Iterator([], {index: 2.5});
      expect(iterator.index).to.equal(0);
      iterator = new Iterator([], {index: -1});
      expect(iterator.index).to.equal(0);
      iterator = new Iterator();
      expect(iterator.index).to.equal(0);
      iterator = new Iterator([], {index: true});
      expect(iterator.index).to.equal(0);
    });
    it('should assign default windowSize', function() {
      expect(iterator.windowSize).to.equal(0);
      iterator = new Iterator();
      expect(iterator.windowSize).to.equal(0);
      iterator = new Iterator([1], {windowSize: 'windowSize'});
      expect(iterator.windowSize).to.equal(1);
      iterator = new Iterator([1], {windowSize: -5});
      expect(iterator.windowSize).to.equal(1);
      iterator = new Iterator([1, 5], {windowSize: 2.0});
      expect(iterator.windowSize).to.equal(2);
      iterator = new Iterator([1, 5], {windowSize: 2.1});
      expect(iterator.windowSize).to.equal(1);
    });
    it('should assign false to circles by default', function() {
      expect(iterator.circles).to.be.false;
      iterator = new Iterator([1], {circles: 'true'});
      expect(iterator.circles).to.be.false;
      iterator = new Iterator([1], {circles: 1});
      expect(iterator.circles).to.be.false;
      iterator = new Iterator();
      expect(iterator.circles).to.be.false;
    });
  });
  describe('should assign input data if it is correct', function() {
    it('should assign correct input data', function() {
      iterator = new Iterator([1, 2, 3],{index: 2, windowSize: 2, circles: true});
      expect(iterator.array).to.eql([1, 2, 3]);
      expect(iterator.index).to.equal(2);
      expect(iterator.circles).to.be.true;
      expect(iterator.windowSize).to.equal(2);
    });
  });
  describe('iterator methods of array modification should work correctly', function() {
    it('should append correctly', function() {
      iterator = new Iterator([1, 2, 3], {index: 2, windowSize: 2, circles: true});
      iterator.append(4);
      expect(iterator.array).to.eql([1, 2, 3, 4]);
    });
    it('should remove correctly', function() {
      iterator = new Iterator([1, 2, 3], {index: 2, windowSize: 2, circles: true});
      iterator.remove(2, 1);
      expect(iterator.array).to.eql([1, 2]);
      expect(iterator.remove.bind(iterator, 1, 5)).to.
      throw ("position is out of range or number of values is too big");
    });
    it('should insert correctly', function() {
      iterator = new Iterator([1, 2, 3]);
      iterator.insert(1, 5, 6, 7, 8);
      expect(iterator.array).to.eql([1, 5, 6, 7, 8, 2, 3]);
      expect(iterator.insert.bind(iterator, 8, 1)).to.
      throw ("position is out of range");
    });
  });
  describe('function current for non-circlic', function() {
    it('should return current items', function() {
      iterator = new Iterator([1, 2, 5], {index: 0, windowSize: 3, circles: false});
      expect(iterator.current()).to.eql([1, 2, 5]);
      iterator.remove(2, 1);
      expect(iterator.current()).to.eql([1, 2]);
      iterator.append(4);
      expect(iterator.current()).to.eql([1, 2, 4]);
      iterator.insert(3, 5);
      expect(iterator.current()).to.eql([1, 2, 4]);
    });
  });
  describe('function current for circlic', function() {
    it('should return current items', function() {
      iterator = new Iterator([1, 2, 5], {index: 0, windowSize: 4, circles: true});
      expect(iterator.current()).to.eql([1, 2, 5]);
      iterator = new Iterator([], {index: 0, windowSize: 1, circles: true});
      expect(iterator.current()).to.eql([]);
      iterator = new Iterator([1, 2, 5], {index: 2, windowSize: 2, circles: true});
      expect(iterator.current()).to.eql([5, 1]);
      iterator = new Iterator([1, 2, 3], {index: 2, windowSize: 4, circles: true});
      iterator.remove(2, 1);
      expect(iterator.current()).to.eql([1, 2]);
      iterator.append(4);
      expect(iterator.current()).to.eql([4, 1, 2]);
      iterator.insert(3, 5);
      expect(iterator.current()).to.eql([4, 5, 1, 2]);
      iterator.append(6);
      expect(iterator.current()).to.eql([4, 5, 6, 1]);
    });
  });
  describe('function forward for non-circlic', function() {
    beforeEach(function() {
      iterator = new Iterator([1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], {index: 0, windowSize: 1, circles: false});
    });
    it('step 1 position forward if no arguments are passed', function() {
      expect(iterator.forward()).to.eql([2]);
      iterator.windowSize = 2;
      expect(iterator.forward()).to.eql([5, 6]);
      iterator.forward();
      expect(iterator.forward()).to.eql([7, 8]);
    });
    it('step number of positions forward according to the input number', function() {
      expect(iterator.forward(2)).to.eql([5]);
      iterator.windowSize = 4;
      expect(iterator.forward(0)).to.eql([5, 6, 7, 8]);
      expect(iterator.forward(6)).to.eql([11, 12, 13, 14]);
    });
    it('should throw errors if input values are out of range or invalid', function() {
      expect(iterator.forward.bind(iterator, -2)).to.
      throw ("move backward with the help of backward function");
      expect(iterator.backward.bind(iterator, -1)).to.
      throw ("move forward with the help of forward function");
      expect(iterator.forward.bind(iterator, 1.1)).to.
      throw ("invalid input values or index is out of range");
      expect(iterator.backward.bind(iterator, 1.1)).to.
      throw ("invalid input values or index is out of range");
      expect(iterator.forward.bind(iterator, -2)).to.
      throw ("move backward with the help of backward function");
      iterator = new Iterator([1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], {index: 0, windowSize: 1, circles: false});
      expect(iterator.forward.bind(iterator, 12)).to.
      throw ("the rest of data's length is less than your step");
      iterator = new Iterator([1, 2, 14], {index: 0, windowSize: 2, circles: false});
      expect(iterator.forward.bind(iterator, 2)).to.
      throw ("the rest of data's length is less than your step");
    });
  });
  describe('errors for iterator when function is passed', function() {
    it('should throw an error if index is out of range or windowSize is invalid', function() {
      iterator = new Iterator([1, 2, 5, 6, 7, 8], {index: 0, windowSize: 1, circles: true});
      var fn = function(x, y) {
        return {
          x: x + 1.5,
          y: ++y
        };
      };
      expect(iterator.forward.bind(iterator, fn)).to.
      throw ("invalid input values or index is out of range");
      expect(iterator.backward.bind(iterator, fn)).to.
      throw ("invalid input values or index is out of range");
      fn = function(x, y) {
        return {
          x: x + 3,
          y: y + 1.3
        };
      };
      expect(iterator.forward.bind(iterator, fn)).to.
      throw ("invalid input values or index is out of range");
      expect(iterator.backward.bind(iterator, fn)).to.
      throw ("invalid input values or index is out of range");
      iterator = new Iterator([1, 2, 5, 6, 7, 8], {index: 0, windowSize: 1, circles: false});
      fn = function(x, y) {
        return {
          x: x + 6,
          y: ++y
        };
      };
      expect(iterator.forward.bind(iterator, fn)).to.
      throw ("invalid input values or index is out of range");
      expect(iterator.backward.bind(iterator, fn)).to.
      throw ("invalid input values or index is out of range");
    });
  });
  describe('should accept function as argument of forward function of non-ciclic', function() {
    beforeEach(function() {
      iterator = new Iterator([1, 2, 5, 6, 7, 8], {index: 0, windowSize: 1, circles: false});
    });
    it('should update property values acoordingly to changes passed through the function', function() {
      var fn = function(x, y) {
        return {
          x: ++x,
          y: ++y
        };
      };
      iterator.forward(fn);
      expect(iterator.index).to.equal(1);
      expect(iterator.windowSize).to.equal(2);
      expect(iterator.forward(fn)).to.eql([5, 6, 7]);
      fn = function(x, y) {
        return {
          x: x * 2,
          y: y - 1
        };
      };
      expect(iterator.forward(fn)).to.eql([7, 8]);
      expect(iterator.index).to.equal(4);
      expect(iterator.windowSize).to.equal(2);
    });
  });
  describe('function forward for circlic', function() {
    beforeEach(function() {
      iterator = new Iterator([1, 2, 5], {index: 1, windowSize: 2, circles: true});
    });
    it('step 1 position forward if no arguments are passed', function() {
      expect(iterator.forward()).to.eql([5, 1]);
      iterator.forward();
      iterator.forward();
      iterator.windowSize = 3;
      expect(iterator.forward()).to.eql([5, 1, 2]);
    });
    it('step number of positions forward according to the input number', function() {
      expect(iterator.forward(3)).to.eql([2, 5]);
      iterator = new Iterator([1, 2, 5], {index: 1, windowSize: 3, circles: true});
      expect(iterator.forward(4)).to.eql([5, 1, 2]);
    });
  });
  describe('should accept function as argument of forward function of ciclic', function() {
    beforeEach(function() {
      iterator = new Iterator([1, 2, 5, 6, 7, 8], {index: 0, windowSize: 1, circles: true});
    });
    it('should update property values acoordingly to changes passed through the function', function() {
      var fn = function(x, y) {
        return {
          x: x - 10,
          y: y + 10
        };
      };
      expect(iterator.forward(fn)).to.eql([5, 6, 7, 8, 1, 2]);
      fn = function(x, y) {
        return {
          x: x * 2,
          y: y - 6
        };
      };
      expect(iterator.forward(fn)).to.eql([7, 8, 1, 2, 5]);
      fn = function(x, y) {
        return {
          x: x + 5,
          y: 0
        };
      };
      expect(iterator.forward(fn)).to.eql([]);
    });
  });

  describe('function backward for non-circlic - numbers', function() {
    beforeEach(function() {
      iterator = new Iterator([1, 2, 5, 6, 7, 8, 9, 10], {index: 7, windowSize: 1, circles: false});
    });
    it('should move n step back if passed data is valid', function() {
      expect(iterator.backward(2)).to.eql([8]);
      iterator.backward(2);
      iterator.backward(3);
      expect(iterator.current()).to.eql([1]);
    });
    it('should move 1 step back if no data is passed', function() {
      expect(iterator.backward()).to.eql([9]);
      iterator.backward();
      iterator.backward();
      expect(iterator.current()).to.eql([7]);
    });
  });
  describe('function backward for non-circlic - errors', function() {
    beforeEach(function() {
      iterator = new Iterator([1, 2, 5, 6, 7, 8], {index: 3, windowSize: 1, circles: false});
    });
    it('should throw an error if there is no possibility to move back', function() {
      expect(iterator.backward.bind(iterator, 5)).to.
      throw ("you've reached the 0 index of the Array");
    });
  });
  describe('function backward for non-circlic - accepts function', function() {
    beforeEach(function() {
      iterator = new Iterator([1, 2, 5, 6, 7, 8], {index: 3, windowSize: 1, circles: false});
    });
    it('should update property values according to the changes', function() {
      var fn = function(x, y) {
        return {
          x: x + 1,
          y: ++y
        };
      };
      expect(iterator.backward(fn)).to.eql([7, 8]);
    });
  });
  describe('function backward for circlic - numbers', function() {
    beforeEach(function() {
      iterator = new Iterator([1, 2, 5, 6, 7, 8], {index: 0, windowSize: 1, circles: true});
    });
    it('should move n step back if passed data is valid', function() {
      expect(iterator.backward(8)).to.eql([7]);
      iterator.backward(2);
      iterator.backward(3);
      expect(iterator.current()).to.eql([8]);
    });
    it('should move 1 step back if no data is passed', function() {
      expect(iterator.backward()).to.eql([8]);
      iterator.backward();
      iterator.backward();
      expect(iterator.current()).to.eql([6]);
    });
  });
  describe('function backward for circlic - accepts function', function() {
    beforeEach(function() {
      iterator = new Iterator([1, 2, 5, 6, 7, 8], {index: 4, windowSize: 10, circles: true});
    });
    it('should update property values according to the changes', function() {
      var fn = function(x, y) {
        return {
          x: x + 1,
          y: ++y
        };
      };
      expect(iterator.backward(fn)).to.eql([8, 1, 2, 5, 6, 7]);
    });
  });
  describe('function jump to', function() {
    beforeEach(function() {
      iterator = new Iterator([1, 2, 5, 6, 7, 8], {index: 0, windowSize: 1, circles: false});
    });
    it('should change index to a passed value', function() {
      iterator.jumpTo(5);
      expect(iterator.index).to.eql(5);
    });
    it('should throw an error if index is out of range or not a valid number', function() {
      expect(iterator.jumpTo.bind(iterator, 6.5)).to.
      throw ("Index is out of range or not a valid number");
        iterator = new Iterator([1, 2, 5, 6, 7, 8], {index: 0, windowSize: 1, circles: true});
      expect(iterator.jumpTo.bind(iterator, -8)).to.
      throw ("Index is out of range or not a valid number");
    });
  });
});