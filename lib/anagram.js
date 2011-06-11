/**
 * 18 May 2008
 * Any word or phrase that exactly reproduces the letters in another is an anagram, Eg. 'dog' is an anagram of 'god'.
 *
 * @author Matt Chadburn <matt@commuterjoy.co.uk>
 */

/**
 * Determines whether a given string in an anagram of the current String object.
 * 
 * @param str {String} The string to be compared with the object's valueOf. 
 * @return {Boolean} True if the string is an anagram, false if not.
 */ 
 String.prototype.isAnagram = function(str){
 	
	if (! str ){
		return false;
	}

	// anagrams need to be an equal length
	if ( this.length != str.length ){
		return false;
	}
	
	// if string is the same
	if ( this.toUpperCase() == str.toUpperCase() ){
		return true;
	}
	
	// emulate charArray
	s = this.toUpperCase().split("");
	t = str.toUpperCase().split("");

	// loop through each item in the prototype string
	for(var i in s){
		for(var j in t){
			if ( t[j] == s[i] ){ // if a matching character is found in the given character splice it from the array
				t.splice(j, 1);
				break;
			}
		}	
	}

	// if every character has been matched we have an empty array.
	if ( t.length == 0 ){
		return true;
	}
	else{
		return false;
	}
	
	
 }