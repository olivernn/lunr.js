/**
 * 18 May 2008
 * Caverphone (2nd edition) is an algorithm to code English words phonetically.
 *  - http://caversham.otago.ac.nz/files/working/ctp150804.pdf
 *  
 * This code has been ported to ECMAScript from the Apache Commons Codec project
 * and is redistributed under the terms of that license.
 *  - http://commons.apache.org/codec/
 *  - trunk/src/java/org/apache/commons/codec/language/Caverphone.java (r651874)
 *  - http://www.apache.org/licenses/LICENSE-2.0
 *   
 * Please assume any errors found in the below code are translation errors
 * inserted by myself and not those of the original authors.
 * 
 * @author Matt Chadburn <matt@commuterjoy.co.uk> 
 */

/**
 * @return {String} A Caverphone 2.0 coded string.
 */ 
String.prototype.caverphone = function() {

        if( this == null || this.length == 0 ) {
            return "1111111111";
        }
		
        // 1. Convert to lowercase
        // 2. Remove anything not A-Z
        var txt = this.toLowerCase().replace(/[^a-z]/g, "");		
	
        // 2.5. Remove final e
        txt = txt.replace(/e$/, "");             // 2.0 only

        // 3. Handle various start options
        txt = txt.replace(/^cough/, "cou2f");
        txt = txt.replace(/^rough/, "rou2f");
        txt = txt.replace(/^tough/, "tou2f");
        txt = txt.replace(/^enough/, "enou2f");  // 2.0 only
        txt = txt.replace(/^trough/, "trou2f");  // 2.0 only - note the spec says ^enough here again, c+p error I assume
        txt = txt.replace(/^gn/, "2n");
        txt = txt.replace(/^mb/, "m2");

        // 4. Handle replacements
        txt = txt.replace(/cq/g, "2q");
        txt = txt.replace(/ci/g, "si");
        txt = txt.replace(/ce/g, "se");
        txt = txt.replace(/cy/g, "sy");
        txt = txt.replace(/tch/g, "2ch");
        txt = txt.replace(/c/g, "k");
        txt = txt.replace(/q/g, "k");
        txt = txt.replace(/x/g, "k");
        txt = txt.replace(/v/g, "f");
        txt = txt.replace(/dg/g, "2g");
        txt = txt.replace(/tio/g, "sio");
        txt = txt.replace(/tia/g, "sia");
        txt = txt.replace(/d/g, "t");
        txt = txt.replace(/ph/g, "fh");
        txt = txt.replace(/b/g, "p");
        txt = txt.replace(/sh/g, "s2");
        txt = txt.replace(/z/g, "s");
        txt = txt.replace(/^[aeiou]/g, "A");
        txt = txt.replace(/[aeiou]/g, "3");
        txt = txt.replace(/j/g, "y");        // 2.0 only
        txt = txt.replace(/^y3/g, "Y3");     // 2.0 only
        txt = txt.replace(/^y/g, "A");       // 2.0 only
        txt = txt.replace(/y/g, "3");        // 2.0 only
        txt = txt.replace(/3gh3/g, "3kh3");
        txt = txt.replace(/gh/g, "22");
        txt = txt.replace(/g/g, "k");
        txt = txt.replace(/s+/g, "S");
        txt = txt.replace(/t+/g, "T");
        txt = txt.replace(/p+/g, "P");
        txt = txt.replace(/k+/g, "K");
        txt = txt.replace(/f+/g, "F");
        txt = txt.replace(/m+/g, "M");
        txt = txt.replace(/n+/g, "N");
        txt = txt.replace(/w3/g, "W3");
        //txt = txt.replace(/wy/g, "Wy");    // 1.0 only
        txt = txt.replace(/wh3/g, "Wh3");
        txt = txt.replace(/w$/g, "3");       // 2.0 only
        //txt = txt.replace(/why/g, "Why");  // 1.0 only
        txt = txt.replace(/w/g, "2");
        txt = txt.replace(/^h/g, "A");
        txt = txt.replace(/h/g, "2");
        txt = txt.replace(/r3/g, "R3");
        txt = txt.replace(/r$/g, "3");       // 2.0 only
        //txt = txt.replace(/ry/g, "Ry");    // 1.0 only
        txt = txt.replace(/r/g, "2");
        txt = txt.replace(/l3/g, "L3");
        txt = txt.replace(/l$/g, "3");       // 2.0 only
        //txt = txt.replace(/ly/g, "Ly");    // 1.0 only
        txt = txt.replace(/l/g, "2");
        //txt = txt.replace(/j/g, "y");      // 1.0 only
        //txt = txt.replace(/y3/g, "Y3");    // 1.0 only
        //txt = txt.replace(/y/g, "2");      // 1.0 only

        // 5. Handle removals
        txt = txt.replace(/2/g, "");
        txt = txt.replace(/3$/, "A");       // 2.0 only
        txt = txt.replace(/3/g, "");

        // 6. put ten 1s on the end
        txt = txt + "111111" + "1111";        // 1.0 only has 6 1s
       
        // 7. take the first six characters as the code
        return txt.substring(0, 10);          // 1.0 truncates to 6

    }
	