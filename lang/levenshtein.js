/**
 * 18 May 2008
 * Levenshtein distance is a metric for measuring the amount of difference between two sequences.
 *  - http://en.wikipedia.org/wiki/Levenshtein_distance
 *
 * The code has been adapted from the WikiBooks project and is being redistributed 
 * under the terms of that license.
 *  - http://en.wikibooks.org/wiki/GNU_Free_Documentation_License
 *  - http://en.wikibooks.org/wiki/Algorithm_implementation/Strings/Levenshtein_distance
 *   
 * Please assume any errors found in the below code are translation errors
 * inserted by myself and not those of the original authors.
 * 
 * @author Matt Chadburn <matt@commuterjoy.co.uk> 
 */

/**
 * @param str {String} The string to be compared with the object's valueOf. 
 * @return {Integer} The minimum number of operations needed to transform one string into the other.
 */ 
String.prototype.levenshtein = function(str){
	
		if (! str ){
			return false;
		}

		str = str.toLowerCase().replace(/[^a-z]/g, "");
	    var t = this.toLowerCase().replace(/[^a-z]/g, "");
		        
	    var i;
        var j;
        var cost;
        var d = new Array();
 
        if ( str.length == 0 ){
                return str.length;
        }
 
        if ( t.length == 0 ){
                return a.length;
        }
 
        for ( i = 0; i <= t.length; i++ ){
                d[ i ] = new Array();
                d[ i ][ 0 ] = i;
        }
		 
        for ( j = 0; j <= str.length; j++ ){
                d[ 0 ][ j ] = j;
        }
 
        for ( i = 1; i <= t.length; i++ )
        {
                for ( j = 1; j <= str.length; j++ )
                {
                        if ( t.toLowerCase().charAt( i - 1 ) == str.toLowerCase().charAt( j - 1 ) )
                        {
                                cost = 0;
                        }
                        else
                        {
                                cost = 1;
                        }
 
                        d[ i ][ j ] = Math.min( d[ i - 1 ][ j ] + 1, d[ i ][ j - 1 ] + 1, d[ i - 1 ][ j - 1 ] + cost );
                }
        }
 
        return d[ t.length ][ str.length ];
}
