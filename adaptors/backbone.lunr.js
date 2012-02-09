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
