/*!
 * Lunr - backbone adaptor
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */
 
/**
* A plugin for Backbone to make integrating your collections with a lunr search index easy.
*
* This adds a search method for querying the index, and returns model instances instead of ids.  It also
* automatically manages the index after models are updated or removed/added from the collection.
*
* Example:
*
*     todos.initSearch(function () {
*       this.field('content')
*     })
*
*     todos.search(query)
*
*/

;(function (Backbone) {

  var toDocument = function (model) {
    return _.extend({}, model.attributes, {cid: model.cid})
  }

  Backbone.Collection.prototype.search = function (term) {
    var results = _.map(this._lunr_idx.search(term), function (cid) {
      return this.getByCid(cid)
    }, this)

    this.trigger('search', results)
    return results
  }

  Backbone.Collection.prototype.initSearch = function (config) {
    var rebuildIndex = _.bind(function () {
      this._lunr_idx.empty()
      this.forEach(function (model) {
        this._lunr_idx.add(toDocument(model))
      }, this)
    }, this)

    var addToIndex = _.bind(function (model) {
      this._lunr_idx.add(toDocument(model))
    }, this)

    this._lunr_idx = Lunr('name', config)
    this._lunr_idx.ref('cid')

    this.bind('change', rebuildIndex)
    this.bind('add', addToIndex)
    this.bind('remove', rebuildIndex)

    rebuildIndex()
  }

})(Backbone)
