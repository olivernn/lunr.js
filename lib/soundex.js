/**
 * 19 May 2008
 * Soundex is a phonetic algorithm for indexing names by sound, as pronounced in English.
 *
 * @author Matt Chadburn <matt@commuterjoy.co.uk>
 */

/**
 * @return {String} The soundex code for the String item's value.
 */
String.prototype.soundex = function( ){

	var i, j, r;
	
	var keyLength = 4; // key size
	
	// mapping of letters to soundex codes
	var map = { B:1,F:1,P:1,V:1,C:2,G:2,J:2,K:2,Q:2,S:2,X:2,Z:2,D:3,T:3,L:4,M:5,N:5,R:6 };
	
	// assign first character to array 'r', the rest to array 's'
	var r = (s = this.toUpperCase().replace(/[^A-Z]/g, "").split("")).splice(0, 1);

	// object to determine the soundex code - if Array.protype.reduc was available it would be neater than this 
	var key = {
	    items : [],
		// private - adds the soundex code for the given letter
	    _check: function(e) {
			var m = map[e]; // lookup the mapping value
			var l = this.items.length - 1; // last but one item
			if ( m ){ // some letters don't have mappings, so undefined
				if ( this.items[l] != m ){
		     	   	this.items.push(m); // add the mapping code to the key's item
					return true;
					}
			}
	    },
		// add, unshift, toString are interface methods to items[] & _check 
	    add:  function(e) { //
	        this._check(e);
	    },
	    unshift: function(e) { //
	        this.items.unshift(e);
	    },
	    toString: function(e) { // output
	        return this.items.join("");
	    }
	};

	var result = s.forEach(key.add, key); // generate key
	key.unshift(r); // prepend the first character of the string

	// return the stringed version of the key, suffix with zeroes when it is shorter
	if ( keyLength > key.toString().length ){
		return key.toString() + (new Array(keyLength - key.toString().length + 1)).join("0");
	}
	else{
		return key.toString().substring(0,keyLength); // truncate to 4 characters
	}
}

