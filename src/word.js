/*!
 * Searchlite - Word
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
* ## Searchlite.Word
* A Searchlite.Word wraps a string and provides methods to convert the string into a form ready for insertion
* into the word index.  It handles exclusion of stop word as well as performing any language based algorithms.
*
* @constructor
* @param {String} raw - the raw word to be used as the base of a search word.
*/
Searchlite.Word = function (raw) {
  this.raw = raw
  this.out = this.raw.replace(/^\W+/, "").replace(/\W+$/, "").toLowerCase()
}

/**
 * ## Searchlite.Word.stopWords
 * A list of words that will be considered stop words.
 */
Searchlite.Word.stopWords = ["the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "this"]

Searchlite.Word.prototype = {

  /**
   * ## Searchlite.Word.prototype.isStopWord
   * Determines whether or not this word is a stop word.
   *
   * @returns {Boolean}
   */
  isStopWord: function () {
    return (Searchlite.Word.stopWords.indexOf(this.raw.toLowerCase()) !== -1)
  },

  /**
   * ## Searchlite.Word.prototype.toString
   * Converts the search word into a string representation
   */
  toString: function () {
    if (this.isStopWord()) return
    this.stem()
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

  })()
}