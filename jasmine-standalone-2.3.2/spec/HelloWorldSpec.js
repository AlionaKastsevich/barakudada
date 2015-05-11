describe("Converter", function() {
	describe('errors for incorrect amount'),function(){
	  it("throw error if negative number", function() {
	  	var currency1=new Currency('RUR',50);
	  	var currency2=new Currency('BYR',14500);
	  	var amount=-5;
	  	var output=convert(currency1,currency2,amount);
	    expect(output).toThrow("Enter positive number");
	  });
	  it("amount is a number",function(){
	  	expect(typeof amount==='number').toBe(true);
	  });
	}
	describe('storage is not empty by default'),function(){
	  it("storage is not empty by default",function(){
	  	expect(storage.length).toEqual(1);
	  })
	}
	describe('one of values is not defined'),function(){
	  it("if amount value not set then output is 0",function(){
	  	var amount=undefined;
	  	var currency1=new Currency('RUR',50);
	  	var currency2=new Currency('BYR',14500);
	  	var output=convert(currency1,currency2,amount);
	  	expect(output).not.toBeUndefined();
	  });
	
	  it("if one of currencies is not defined then it state as USD",function(){
	  	var curency1,currency2,currency3,amount;
	  	curency1=undefined;
	  	currency2=new Currency('BYR',14500);;
	  	currency3=storage[0];
	  	amount=Math.random()*1000;
	  	var output=convert(currency1,currency2,amount);
	  	expect(output).toEqual(currency3,currency2,amount);
	  })
	};
	describe('currency is an object'),function(){
	  it("currency is an object",function(){
	  	var currency=new Currency('BYR',14500);
	  	expect(typeof currency==='object').toBe(true)
	  })
	 };
	 describe('currency has all nessesary properties'),function(){
	  it("currency has property name",function(){
	  	var currency=new Currency('LTL',450);
	  	expect(currency.hasOwnProperty('name')).toBe(true)
	  });
	  it("currency has property rate",function(){
	  	var currency=new Currency('RUR',50);
	  	expect(currency.hasOwnProperty('rate')).toBe(true)
	  })
	}
	describe('currency converts correctly'),function(){
	  it("currency exchanges correctly",function(){
	  	var currency1=new Currency('RUR',50);
	  	var currency2=new Currency('BYR',14500);
	  	var amount=Math.random()*1000;
	  	expect(convert(currency1,currency2,amount)).toEqual(currency1*amount*currency2);
	  })
	}
});






