/**
 * 18 May 2008
 * Soundex is a phonetic algorithm for indexing names by sound, as pronounced in English.
 * 
 * Refined Sounder profiles the entire string (not just the first 4 constants) so is a
 * litle better geared towards spellchecking than phoneme matching.
 *  
 * This code has been ported to ECMAScript from the Apache Commons Codec project
 * and is redistributed under the terms of that license.
 *  - http://commons.apache.org/codec/
 *  - trunk/src/java/org/apache/commons/codec/language/RefinedSoundex.java (r651573)
 *  - http://www.apache.org/licenses/LICENSE-2.0
 *   
 * Please assume any errors found in the below code are translation errors
 * inserted by myself and not those of the original authors.
 * 
 * @author Matt Chadburn <matt@commuterjoy.co.uk> 
 */

// Mapping
// - 01360240043788015936020505
// - ABCDEFGHIJKLMNOPQRSTUVWXYZ

// array: emulate toCharArray
var US_ENGLISH_MAPPING = "01360240043788015936020505".split("");
var lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * @return {String} A Refined Soundex coded string.
 */ 
String.prototype.soundexRefined = function(){

        if (this == null){ 
            return null;
        }

        var str = this.toUpperCase().replace(/[^A-Z]/g, "");

        if (this.length == 0) {
            return str;
        }

        var sBuf = new String();
        sBuf += (str.charAt(0));
		
	   
        var last, current;
        last = '*';

        for (var i = 0; i < str.length; i++) {
			
			current = getMappingCode(str.charAt(i));
				
            if (current == last) {
                continue;
            } //else if (current != 0) { /// ?? TODO. I took this out as it was preventing the zeroes being output.
                sBuf += current;
            //}

            last = current;
        }

        return sBuf.toString();
    }


function getMappingCode(c) {

	for(var j = 0; j < lookup.length; j++){
		if ( lookup[j] == c ){
			return US_ENGLISH_MAPPING[j];
			}
		}
	return 0;
    }
