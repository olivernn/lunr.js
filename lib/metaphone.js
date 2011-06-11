/**
 * 18 May 2008
 * Metaphone is a phonetic algorithm, an algorithm for indexing words by their sound, when
 * pronounced in English. 
 *  - http://en.wikipedia.org/wiki/Metaphone
 *  
 * This code has been ported to ECMAScript from the Apache Commons Codec project
 * and is redistributed under the terms of that license.
 *  - http://commons.apache.org/codec/
 *  - trunk/src/java/org/apache/commons/codec/language/Metaphone.java (r651875)
 *  - http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Please assume any errors found in the below code are translation errors
 * inserted by myself and not those of the original authors.
 * 
 * @author Matt Chadburn <matt@commuterjoy.co.uk> 
 */

/**
 * @param max {Integer} The Metaphone key length, defaults to '4'.
 * @return {String} A Metaphone coded key.
 */
String.prototype.metaphone = function(max){
	
	var FRONTV = "EIY";
	var VARSON = "CSPTG";
	
	var maxCodeLen = max || 4; 
	
	var hard = false;
	
	if ((this == null) || (this.length == 0)) {
            return "";
        }	

    // emulate toCharArray() ;
	var inwd = this.toUpperCase().replace(/[^A-Z]/g, "").split("");
	
	var local = ""; // manipulate
	var code = ""; //   output
	
    switch(inwd[0]) {
	    case 'K' : 
	    case 'G' : 
	    case 'P' : /* looking for KN, etc*/
	        if (inwd[1] == 'N') {
	            local = local.append(inwd, 1, inwd.length);
	        } else {
	            local = local.append(inwd);
	        }
	        break;
        case 'A': /* looking for AE */
            if (inwd[1] == 'E') {
                local = local.append(inwd, 1, inwd.length);
            } else {
                local = local.append(inwd);
            }
            break;
        case 'W' : /* looking for WR or WH */
            if (inwd[1] == 'R') {   // WR -> R
                local = local.append(inwd, 1, inwd.length); 
                break ;
            }
            if (inwd[1] == 'H') {
                local = local.append(inwd, 1, inwd.length);
                local = local.setCharAt(0, 'W'); // WH -> W
            } else {
                local = local.append(inwd);
            }
            break;
        case 'X' : /* initial X becomes S */
            inwd[0] = 'S';
            local = local.append(inwd);
            break ;
        default :
            local = local.append(inwd);
    } // now local has working string with initials fixed

    var wdsz = local.length;
    var n = 0;
				
    while ((code.length < maxCodeLen) && (n < wdsz) ) { // max code size of 4 works well
        var symb = local.charAt(n);
			
        // remove duplicate letters except C
        if ((symb != 'C') && (isPreviousChar( local, n, symb )) ) {
            n++ ;
        } else { // not dup
            switch(symb) {
                case 'A' : case 'E' : case 'I' : case 'O' : case 'U' :
                    if (n == 0) { 
                        code += symb;
                    }
                    break ; // only use vowel if leading char
                case 'B' :
                    if ( isPreviousChar(local, n, 'M') && 
                         isLastChar(wdsz, n) ) { // B is silent if word ends in MB
						break;
                    }
                    code += symb;
                    break;
                case 'C' : // lots of C special cases
                    /* discard if SCI, SCE or SCY */
                    if ( isPreviousChar(local, n, 'S') && 
                         !isLastChar(wdsz, n) && 
                         (FRONTV.indexOf(local.charAt(n + 1)) >= 0) ) { 
                        break;
                    }
                    if (regionMatch(local, n, "CIA")) { // "CIA" -> X
                        code += 'X'; 
                        break;
                    }
                    if (!isLastChar(wdsz, n) && 
                        (FRONTV.indexOf(local.charAt(n + 1)) >= 0)) {
                        code += 'S';
                        break; // CI,CE,CY -> S
                    }
                    if (isPreviousChar(local, n, 'S') &&
						isNextChar(local, n, 'H') ) { // SCH->sk
                        code += 'K' ; 
                        break ;
                    }
                    if (isNextChar(local, n, 'H')) { // detect CH
                        if ((n == 0) && 
                        	(wdsz >= 3) && 
                            isVowel(local,2) ) { // CH consonant -> K consonant
                            code += 'K';
                        } else { 
                            code += 'X'; // CHvowel -> X
                        }
                    } else { 
                        code += 'K';
                    }
                    break ;
                case 'D' :
                    if (!isLastChar(wdsz, n + 1) && 
                        isNextChar(local, n, 'G') && 
                        (FRONTV.indexOf(local.charAt(n + 2)) >= 0)) { // DGE DGI DGY -> J 
                        code += 'J'; n += 2;
                    } else { 
                        code += 'T';
                    }
                    break ;
                case 'G' : // GH silent at end or before consonant
                    if (isLastChar(wdsz, n + 1) && 
                        isNextChar(local, n, 'H')) {
                        break;
                    }
                    if (!isLastChar(wdsz, n + 1) &&  
                        isNextChar(local,n,'H') && 
                        !isVowel(local,n+2)) {
                        break;
                    }
                    if ((n > 0) && 
                    	( regionMatch(local, n, "GN") ||
					      regionMatch(local, n, "GNED") ) ) {
                        break; // silent G
                    }
                    if (isPreviousChar(local, n, 'G')) {
                        hard = true ;
                    } else {
                        hard = false ;
                    }
                    if (!isLastChar(wdsz, n) && 
                        (FRONTV.indexOf(local.charAt(n + 1)) >= 0) && 
                        (!hard)) {
                        code += 'J';
                    } else {
                        code += 'K';
                    }
                    break ;
                case 'H':
                    if (isLastChar(wdsz, n)) {
                        break ; // terminal H
                    }
                    if ((n > 0) && 
                        (VARSON.indexOf(local.charAt(n - 1)) >= 0)) {
                        break;
                    }
                    if (isVowel(local,n+1)) {
                        code += 'H'; // Hvowel
                    }
                    break;
                case 'F': 
                case 'J' : 
                case 'L' :
                case 'M': 
                case 'N' : 
                case 'R' :
                    code += symb; 
                    break;
                case 'K' :
                    if (n > 0) { // not initial
                        if (!isPreviousChar(local, n, 'C')) {
                            code += symb;
                        }
                    } else {
                        code += symb; // initial K
                    }
                    break ;
                case 'P' :
                    if (isNextChar(local,n,'H')) {
                        // PH -> F
                        code += 'F';
                    } else {
                        code += symb;
                    }
                    break ;
                case 'Q' :
                    code += 'K';
                    break;
                case 'S' :
                    if (regionMatch(local,n,"SH") || 
					    regionMatch(local,n,"SIO") || 
					    regionMatch(local,n,"SIA")) {
                        code += 'X';
                    } else {
                        code += 'S';
                    }
                    break;
                case 'T' :
                    if (regionMatch(local,n,"TIA") || 
						regionMatch(local,n,"TIO")) {
                        code += 'X'; 
                        break;
                    }
                    if (regionMatch(local,n,"TCH")) {
						// Silent if in "TCH"
                        break;
                    }
                    // substitute numeral 0 for TH (resembles theta after all)
                    if (regionMatch(local,n,"TH")) {
                        code += '0';
                    } else {
                        code += 'T';
                    }
                    break ;
                case 'V' :
                    code.append('F'); break ;
                case 'W' : case 'Y' : // silent if not followed by vowel
                    if (!isLastChar(wdsz,n) && 
                    	isVowel(local,n+1)) {
                        code += symb;
                    }
                    break ;
                case 'X' :
                    code += 'K';
				   code += 'S';
                    break ;
                case 'Z' :
                    code += 'S'; break ;
                } // end switch
                n++ ;
            } // end else from symb != 'C'
            if (code.length > maxCodeLen) {
            		code.substring(0, maxCodeLen);
            }
			
	}
	return code.toString();
}

/**
 * Partially emulates append method in StringBuffer (cf. Java)
 * 
 * @param arr {Array}
 * @param offset {Integer}
 * @param len {Integer}
 */
String.prototype.append = function(arr, offset, len){
	
	/// TODO - think I can delete this
	if ( typeof arr == 'string' ){
		var a = this.valueOf();
		return a + arr;
	}
	
	offset = offset || 0;
	len = len || arr.length;	
	
	var a = arr.slice(offset, len);
	return a.join("").toString();
}

/**
 * Partially emulates the setCharAt method in String (cf. Java)
 * 
 * @param {Integer} index
 * @param {String} c
 * @return {String}
 */
String.prototype.setCharAt = function(index, c){
	var before = '';
	var after;
	if ( index > 0 ){
		before = this.slice(index, index+1);
		}
	after = this.slice(index+1, this.length);
	return before + c + after;
}


/**
 * 
 * @param {Object} str
 * @param {Object} index
 * @return {Boolean} 
 */
function isVowel(str, index){
	var vowels = "AEIOU";
	return vowels.indexOf(str.charAt(index)) >= 0;
	}

function isPreviousChar(str, index, c) {
	var matches = false;
	if( index > 0 &&
	    index < str.length ) {
		matches = str.charAt(index - 1) == c;
	}
	return matches;
	}	

function isNextChar(str, index, c) {
	var matches = false;
	if( index >= 0 &&
	    index < str.length - 1 ) {
		matches = str.charAt(index + 1) == c;
	}
	return matches;
	}

function regionMatch(str, index, test) {
	var matches = false;
	if( index >= 0 &&
	    (index + test.length - 1) < str.length ) {
		var substring = str.substring( index, index + test.length);
		matches = substring.equals( test );
	}
	return matches;
	}

function isLastChar(wdsz, n) {
		return n + 1 == wdsz;
	}
	    