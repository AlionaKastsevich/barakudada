Custom jQuery Program Version 3.0 18/04/2015 

GENERAL USAGE NOTES
________________________________________________________________________

1) addClass: 

	- Accepts types: 'string', 'function';
	- Doesn't replace the class but adds it;
	- More than one class may be added at a time, separated by a space;
	- Chainable;

	Examples:
		1.1) $( "div" ).addClass(function( index, currentClass ) {
		  var addedClass;
		  if ( currentClass === "a" ) {
		  	addedClass = "green";
		  }
		  return addedClass;
		});

		1.2) $( "div" ).addClass(function( index ) {
		  return "item-" + index;
		});

		1.3) $( "div" ).addClass('class1');
		1.4) $( "div" ).addClass('class2 class3');

2)  append: 
	
	- Accepts types: 'string', jQuery 3.0 object (for example: $('p'));
	- Inserts the specified content as the last child of each element
	- You can select an element on the page and insert it into another,
	  If an element selected this way is inserted into a single location 
	  elsewhere in the DOM, it will be moved into the target (not cloned),
	  Important: If there is more than one target element, however, cloned
	  copies of the inserted element will be created for each target except 
	  for the last one.
	- Chainable;

	Examples:
		2.1) $( ".a" ).append( $( "p" ) );
		2.2) $( "p" ).append( "<strong> Hello</strong>" );

3) html:
	
	- Accepts 'string', 'function', can be called without arguments;
	- Without arguments gets the HTML contents of the first element in the
	set of matched elements;
	- Taking 'string' or 'function' as an argument, sets the HTML contents of
	each element in the set of matched elements, 'function' can accept index;
	- Any content that is in that element is being removed and then replaced
	by the new content;
	- Ability to chain depends;

	Examples:
		3.1) $( "div" ).html(function(index) {
		  var emphasis = "<em>" + $( "div" ).length + " paragraphs!</em>";
		  return "<p>All new content for " + index + emphasis + "</p>";
		});
		3.2) $( "div" ).html('<em></em>');
		3.3) $( "div" ).html();

4) attr:

	- Accepts 'string', 'function' as value, 'object' as attribute;
	- Get the value of an attribute for the first element in the set of
	matched elements or set one or more attributes for every matched element;
	- If 1 argument passed or the result of the function is undefined 
	returns the value of the attribute;
	- If typeof attribute is 'object' - each key-value pair in the object
	adds or modifies an attribute;
	- 'function' can compute the value based on other properties of the
	element as it takes index and old value of the attribute, if old value
	is null then just returns this;
	- Ability to chain depends.

	Examples:
		4.1) $('div').attr({
				alt: "Beijing Brush Seller",
				title: "photo by Kelly Clark"
			 });
		4.2) $( "div" ).attr( "title", function( i, val ) {
			  return val + " - BATMAN";
			});
		4.3) $( "a" ).attr('href','https://onliner.by');
		4.4) $( "a" ).attr( "href", function() {
			  return this.title;
			});

5)  children:

	- Get the children of each element in the set of matched elements,
	optionally filtered by a selector;
	- Chainable.

	Examples:
		5.1) $('.a').children().children('.fff').css('color','red');

6) css: 

	- Get the value of a computed style property for the first element in
	the set of matched elements or set one or more CSS properties for every
	matched element.
	- Accepts 'string', 'array', 'object';
	- When it is passed 'string' or 'array' as property it is returned the 
	computed style properties for the first element in the set of matched 
	elements;
	- In case of object being passed property-value pairs are being set or 
	modified; also it accepts functions as value of the object's property in the
	form: function(index,style){};
	- Function can be passed as value in the form function(index,style){}
	- Ability to chain depends.
	
	Examples:
		6.1) $('.a').css('width','150px').css('height','100px')
		6.2) $('.a').css( "width", function( index ) {
			  return index * 50+"px" ;
			});
		6.3) $( "div" ).on( "click", function() {
			  $( this ).css({
			    width: function( index, value ) {
			      return parseInt( value ) * 1.2+'px';
			    },
			    height: function( index, value ) {
			      return parseInt( value ) * 1.2+'px';
			    }
			  });
			});
		6.4) $('.a').css('color','red');
		6.5) $( ".a" ).one( "click", function() {
				$( this ).css( "color", "blue" );
			 });
		6.6) $( "div" ).one( "click", function() {
				$( this ).children().children('.fff').css({
				    color: function( index, value ) {
				      	return 'yellow';
				    },
				});
			});

7) data: 

	- Store arbitrary data associated with the matched elements or return the
	value at the named data store for the first element in the set of matched
	elements;
	- Stores data in the form, replaces the existing data: 	
			-- data( key, value ), //value can not be undefined,
								   //if so,when behaves as there is no value;
			-- data( obj );

	- Returns data in the form:
			-- data( key ),
			-- data();
	- Takes key as camelCase and 'dashed'-notation;		
	- Unchainable.

	Examples:
		7.1) $( "body" ).data('hidden',"true")// undefined
		7.2) $( "body" ).data( "hidden" ) === true// true
		7.3) $( "body" ).data( )// Object {hidden: true}
		7.5) $( "body" ).data( "options",'{"name":"John"}' )// undefined
	    7.6) $( "body" ).data()// Object {hidden: true, options: Object}
	    7.7) $( "body" ).data().options// Object {name: "John"}
	    7.8) $( "body" ).data( "options").name // "John";
	    7.9) $( "body" ).data( { baz: [ 1, 2, 3 ] } );//undefined
	    7.10) $( "body" ).data( 'baz', undefined );//[1, 2, 3]

8) on:
	
	- Attach an event handler function for one or more events to the
	selected elements.
	- Chainable;

	Examples:
		8.1) $( ".a" ).on( "click", function() {
			  console.log( $( this ).html() );
			});

9) one:
	
	-The  .one() method is identical to  .on(), except that the handler is
	unbound after its first invocation.
	- Chainable;

	Examples:
		9.1) $( "div" ).one( "click", function() {
				$( this ).css({
				    fontSize: "30px",
				});
			})

10) each:
	
	- Iterate over a jQuery object, executing a function for each matched 
	element.

	Examples:
		10.1) $('.a')
			    .each(function (index) {
			        $(this).html('<b>' + index + '</b>')
			    })
			    .append($('p'))
			    .addClass('my-super-class')
			    .css({
			        backgroundColor: 'rebeccapurple'
			});
__________________________________________________________________________
Author: Kastsevich Aliona
e-mail: stsabrina@yandex.ru
Copyright 2015. All rights reserved.