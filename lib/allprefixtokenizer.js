/*!
 * lunr.allprefixtokenizer
 * Copyright (C) @2018 Prasad
 */

/*
 * Tokenizer to allow all-prefix match, helpful in auto-suggestion.
 * INCOMING TEXT: Simple Line
 * TOKENIZED TO : [S, Si, Sim, Simp, Simpl, Simple, L, Li, Lin, Line]
 * MATCHES WITH : Simply
 *
 * USAGE:
 * var idx = lunr(function(){
 *    this.ref('refid');
 *    this.field('field1');
 *    // ...
 *
 *    // 1. Remove stemmer from pipeline.
 *    // 2. Activate tokenzier.
 *    this.pipeline.remove(lunr.stemmer);
 *    this.tokenizer = lunr.allprefixtokenizer;
 *
 *    // ...add doc...
 * });
 */
lunr.allprefixtokenizer = function(obj, metadata) {

	if (obj == null || obj == undefined) return [];

	/* Recursively grab the tokens when Array of string is sent. */
	if (Array.isArray(obj)) {
		var tokens = [], _this = this;
		obj.map(function(t){
			var subtokens = _this.tokenizer(t, metadata);
			tokens = tokens.concat(subtokens);
		});
		return tokens;
	}

	var str = obj.toString().toLowerCase();

	var tokens = [];
	for (var index = 0, start = 0, len = str.length; index < len; ++index) {
		var char = str.charAt(index);
		/* Skip separator */
		if (char.match(lunr.tokenizer.separator)) {
			start = index + 1;
			continue;
		}
		var strslice = str.slice(start, index + 1);
		var tokenMetadata = lunr.utils.clone(metadata) || {}
		tokenMetadata["position"] = [start, index+1];
		tokenMetadata["index"]    = tokens.length;

		tokens.push(new lunr.Token(strslice, tokenMetadata));
	}
	return tokens;
}

lunr.Pipeline.registerFunction(lunr.allprefixtokenizer, 'allprefixtokenizer');
