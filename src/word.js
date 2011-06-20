Search.Word = function (raw) {
  this.raw = raw
  this.out = this.raw.replace(/^\W+/, "").replace(/\W+$/, "").toLowerCase()
}

Search.Word.stopWords = ["the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "this"]

Search.Word.prototype = {

  isStopWord: function () {
    return (Search.Word.stopWords.indexOf(this.raw.toLowerCase()) !== -1)
  },

  toString: function () {
    if (this.isStopWord()) return
    this.stem()
    // this.metaphone()
    return this.out
    },

  /**
   * 18 May 2008
   * Stemming is the process for reducing inflected (or sometimes derived) words to their stem, base or root
   * form. Porter stemming is designed for the English language.
   * 
   * This code has been slighly adapted from Martin Porter's examples.
   *  - http://tartarus.org/~martin/PorterStemmer/
   *  
   * Please assume any errors found in the below code are translation errors
   * inserted by myself and not those of the original authors.
   *  
   * @author Matt Chadburn <matt@commuterjoy.co.uk>
   * 
   * June 2011
   * Additions and modifications by Oliver Nightingale
   *
   */
  stem: (function () {
    var step2list = {
      "ational" : "ate",
      "tional"  : "tion",
      "enci"    : "ence",
      "anci"    : "ance",
      "izer"    : "ize",
      "bli"     : "ble",
      "alli"    : "al",
      "entli"   : "ent",
      "eli"     : "e",
      "ousli"   : "ous",
      "ization" : "ize",
      "ation"   : "ate",
      "ator"    : "ate",
      "alism"   : "al",
      "iveness" : "ive",
      "fulness" : "ful",
      "ousness" : "ous",
      "aliti"   : "al",
      "iviti"   : "ive",
      "biliti"  : "ble",
      "logi"    : "log"
    }

    var step3list = {
      "icate" : "ic",
      "ative" : "",
      "alize" : "al",
      "iciti" : "ic",
      "ical"  : "ic",
      "ful"   : "",
      "ness"  : ""
    }

    var c = "[^aeiou]";          // consonant
    var v = "[aeiouy]";          // vowel
    var C = c + "[^aeiouy]*";    // consonant sequence
    var V = v + "[aeiou]*";      // vowel sequence

    var mgr0 = "^(" + C + ")?" + V + C;               // [C]VC... is m>0
    var meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$";  // [C]VC[V] is m=1
    var mgr1 = "^(" + C + ")?" + V + C + V + C;       // [C]VCVC... is m>1
    var s_v   = "^(" + C + ")?" + v;                   // vowel in stem

    return function () {
      var stem;
      var suffix;
      var firstch;
      var origword = this.out;
      var w = this.out;

      if (origword.length < 3) return origword

      var re;
      var re2;
      var re3;
      var re4;

      firstch = origword.substr(0,1);
      if (firstch == "y") {
        w = firstch.toUpperCase() + w.substr(1);
      }

      // Step 1a
      re = /^(.+?)(ss|i)es$/;
      re2 = /^(.+?)([^s])s$/;

      if (re.test(w)) { 
        w = w.replace(re,"$1$2");
      } else if (re2.test(w)) { 
        w = w.replace(re2,"$1$2");
      }

      // Step 1b
      re = /^(.+?)eed$/;
      re2 = /^(.+?)(ed|ing)$/;
      if (re.test(w)) {
        var fp = re.exec(w);
        re = new RegExp(mgr0);
        if (re.test(fp[1])) {
          re = /.$/;
          w = w.replace(re,"");
        }
      } else if (re2.test(w)) {
        var fp = re2.exec(w);
        stem = fp[1];
        re2 = new RegExp(s_v);
        if (re2.test(stem)) {
          w = stem;
          re2 = /(at|bl|iz)$/;
          re3 = new RegExp("([^aeiouylsz])\\1$");
          re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
          if (re2.test(w)) {  w = w + "e"; }
          else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
          else if (re4.test(w)) { w = w + "e"; }
        }
      }

      // Step 1c
      re = /^(.+?)y$/;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        re = new RegExp(s_v);
        if (re.test(stem)) { w = stem + "i"; }
      }

      // Step 2
      re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        suffix = fp[2];
        re = new RegExp(mgr0);
        if (re.test(stem)) {
          w = stem + step2list[suffix];
        }
      }

      // Step 3
      re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        suffix = fp[2];
        re = new RegExp(mgr0);
        if (re.test(stem)) {
          w = stem + step3list[suffix];
        }
      }

      // Step 4
      re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
      re2 = /^(.+?)(s|t)(ion)$/;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        re = new RegExp(mgr1);
        if (re.test(stem)) {
          w = stem;
        }
      } else if (re2.test(w)) {
        var fp = re2.exec(w);
        stem = fp[1] + fp[2];
        re2 = new RegExp(mgr1);
        if (re2.test(stem)) {
          w = stem;
        }
      }

      // Step 5
      re = /^(.+?)e$/;
      if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        re = new RegExp(mgr1);
        re2 = new RegExp(meq1);
        re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
        if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
          w = stem;
        }
      }

      re = /ll$/;
      re2 = new RegExp(mgr1);
      if (re.test(w) && re2.test(w)) {
        re = /.$/;
        w = w.replace(re,"");
      }

      if (firstch == "y") {
        w = firstch.toLowerCase() + w.substr(1);
      }

      this.out = w;
    }

  })(),

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
   *
   * @param max {Integer} The Metaphone key length, defaults to '4'.
   * @return {String} A Metaphone coded key.
   *
   * June 2011
   * Additions and modifications by Oliver Nightingale
   */
  metaphone: (function () {

    var isVowel = function (str, index){
      var vowels = "AEIOU";
      return vowels.indexOf(str.charAt(index)) >= 0;
    }

    var isPreviousChar = function (str, index, c) {
      var matches = false;
      if (index > 0 && index < str.length) {
        matches = str.charAt(index - 1) == c;
      }
      return matches;
    } 

    var isNextChar = function (str, index, c) {
      var matches = false;
      if (index >= 0 && index < str.length - 1 ) {
        matches = str.charAt(index + 1) == c;
      }
      return matches;
    }

    var regionMatch = function (str, index, test) {
      var matches = false;
      if(index >= 0 && (index + test.length - 1) < str.length ) {
        var substring = str.substring( index, index + test.length);
        matches = substring == test;
      }
      return matches;
    }

    var isLastChar = function (wdsz, n) {
        return n + 1 == wdsz;
    }

    /**
     * Partially emulates the setCharAt method in String (cf. Java)
     * 
     * @param {Integer} index
     * @param {String} c
     * @return {String}
     */
    var setCharAt = function (str, index, c) {
      var before = '';
      var after;
      if ( index > 0 ){
        before = str.slice(index, index+1);
        }
      after = str.slice(index+1, str.length);
      return before + c + after;
    }

    /**
     * Partially emulates append method in StringBuffer (cf. Java)
     * 
     * @param arr {Array}
     * @param offset {Integer}
     * @param len {Integer}
     */
    var append = function (str, arr, offset, len) {
      if (typeof arr == 'string'){
        var a = str.valueOf();
        return a + arr;
      }

      offset = offset || 0;
      len = len || arr.length;  

      var a = arr.slice(offset, len);
      return a.join("").toString();
    }

    return function (max) {
      var FRONTV = "EIY";
      var VARSON = "CSPTG";
      var maxCodeLen = max || 4; 
      var hard = false;
      var str = this.out

      if ((str == null) || (str == 0)) return

      // emulate toCharArray() ;
      var inwd = str.toUpperCase().replace(/[^A-Z]/g, "").split("");

      var local = ""; // manipulate
      var code = ""; //   output

        switch(inwd[0]) {
          case 'K' : 
          case 'G' : 
          case 'P' : /* looking for KN, etc*/
              if (inwd[1] == 'N') {
                  local = append(local, inwd, 1, inwd.length);
              } else {
                  local = append(local, inwd);
              }
              break;
            case 'A': /* looking for AE */
                if (inwd[1] == 'E') {
                    local = append(local, inwd, 1, inwd.length);
                } else {
                    local = append(local, inwd);
                }
                break;
            case 'W' : /* looking for WR or WH */
                if (inwd[1] == 'R') {   // WR -> R
                    local = append(local, inwd, 1, inwd.length); 
                    break ;
                }
                if (inwd[1] == 'H') {
                    local = append(local, inwd, 1, inwd.length);
                    local = setCharAt(local, 0, 'W'); // WH -> W
                } else {
                    local = append(local, inwd);
                }
                break;
            case 'X' : /* initial X becomes S */
                inwd[0] = 'S';
                local = append(local, inwd);
                break ;
            default :
                local = append(local, inwd);
        } // now local has working string with initials fixed

        var wdsz = local.length;
        var n = 0;

        while ((code.length < maxCodeLen) && (n < wdsz) ) { // max code size of 4 works well
            var symb = local.charAt(n);

            // remove duplicate letters except C
            if ((symb != 'C') && (isPreviousChar(local, n, symb))) {
                n++ ;
            } else { // not dup
                switch(symb) {
                    case 'A' : case 'E' : case 'I' : case 'O' : case 'U' :
                      if (n == 0) { 
                        code += symb;
                      }
                      break ; // only use vowel if leading char
                    case 'B' :
                      if (isPreviousChar(local, n, 'M') && isLastChar(wdsz, n)) {
                        // B is silent if word ends in MB
                        break;
                      }
                      code += symb;
                      break;
                    case 'C' : // lots of C special cases
                      /* discard if SCI, SCE or SCY */
                      if (isPreviousChar(local, n, 'S') && !isLastChar(wdsz, n) && (FRONTV.indexOf(local.charAt(n + 1)) >= 0)) { 
                        break;
                      }
                      if (regionMatch(local, n, "CIA")) { // "CIA" -> X
                        code += 'X'; 
                        break;
                      }
                      if (!isLastChar(wdsz, n) && (FRONTV.indexOf(local.charAt(n + 1)) >= 0)) {
                        code += 'S';
                        break; // CI,CE,CY -> S
                      }
                      if (isPreviousChar(local, n, 'S') && isNextChar(local, n, 'H') ) { // SCH->sk
                        code += 'K' ; 
                        break ;
                      }
                      if (isNextChar(local, n, 'H')) { // detect CH
                        if ((n == 0) && (wdsz >= 3) && isVowel(local,2) ) { // CH consonant -> K consonant
                          code += 'K';
                        } else { 
                          code += 'X'; // CHvowel -> X
                        }
                      } else { 
                        code += 'K';
                      }
                      break ;
                    case 'D' :
                      if (!isLastChar(wdsz, n + 1) && isNextChar(local, n, 'G') && (FRONTV.indexOf(local.charAt(n + 2)) >= 0)) { // DGE DGI DGY -> J 
                        code += 'J'; n += 2;
                      } else { 
                        code += 'T';
                      }
                      break ;
                    case 'G' : // GH silent at end or before consonant
                      if (isLastChar(wdsz, n + 1) && isNextChar(local, n, 'H')) {
                        break;
                      }
                      if (!isLastChar(wdsz, n + 1) && isNextChar(local,n,'H') && !isVowel(local,n+2)) {
                        break;
                      }
                      if ((n > 0) && (regionMatch(local, n, "GN") || regionMatch(local, n, "GNED"))) {
                        break; // silent G
                      }
                      if (isPreviousChar(local, n, 'G')) {
                        hard = true ;
                      } else {
                        hard = false ;
                      }
                      if (!isLastChar(wdsz, n) && (FRONTV.indexOf(local.charAt(n + 1)) >= 0) && (!hard)) {
                        code += 'J';
                      } else {
                        code += 'K';
                      }
                      break ;
                    case 'H':
                      if (isLastChar(wdsz, n)) {
                        break ; // terminal H
                      }
                      if ((n > 0) && (VARSON.indexOf(local.charAt(n - 1)) >= 0)) {
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
                      if (regionMatch(local,n,"SH") || regionMatch(local,n,"SIO") || regionMatch(local,n,"SIA")) {
                        code += 'X';
                      } else {
                        code += 'S';
                      }
                      break;
                    case 'T' :
                      if (regionMatch(local,n,"TIA") || regionMatch(local,n,"TIO")) {
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
                      append(code, 'F'); break ;
                    case 'W' : case 'Y' : // silent if not followed by vowel
                      if (!isLastChar(wdsz,n) && isVowel(local,n+1)) {
                        code += symb;
                      }
                      break ;
                    case 'X' :
                      code += 'K';
                      code += 'S';
                      break ;
                    case 'Z' :
                      code += 'S';
                      break ;
                    } // end switch

                    n++ ;
                } // end else from symb != 'C'
                if (code.length > maxCodeLen) {
                  code.substring(0, maxCodeLen);
                }

      }
      this.out = code.toString();
    }
  })()
}