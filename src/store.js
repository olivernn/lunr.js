/*!
 * Lunr - Store
 * Copyright (C) 2011 Oliver Nightingale
 * MIT Licensed
 */

/**
 * Normalize the vendor prefixed indexedDB object into the standard indexedDB object.
 */
if (window.indexedDB === undefined) {
  if (window.webkitIndexedDB) {
    window.indexedDB = webkitIndexedDB
  } else {
    window.indexedDB = mozIndexedDB
  };
};

if (window.IDBTransaction === undefined) {
  window.IDBTransaction = webkitIDBTransaction
};

if (window.IDBKeyRange === undefined) {
  window.IDBKeyRange = webkitIDBKeyRange
};

/**
 * ## Lunr.Store
 * A wrapper around the indexedDB api to provide a common, uniform, interface to the storage engine being
 * used by Lunr.  This hides away, as far as is possible, the implementation details of storing the indexes
 * in indexedDB.
 *
 * An instance of Lunr.Store represents once indexedDB database and one objectStore in that database.  If
 * the named database does not exist then it is automatically created.
 *
 * @constructor
 * @param {String} name - the name for this indexedDB database
 */
Lunr.Store = function (name) {
  this.name = name
  this.version = "1"
}

/**
 * @private
 */
Lunr.Store.prototype = {

  /**
   * ## Lunr.Store.prototype.init
   * Initializes the store object.  For indexedDB this is required and will either create or open the database
   * of the given name.
   *
   * @returns {Lunr.Deferred} a deferred object that will be resolved when the store is ready to be used.
   */
  init: function () {
    var self = this
    var deferred = new Lunr.Deferred ()
    var request = indexedDB.open(this.name, "")
    request.onsuccess = function (e) {
      self.db = this.result

      if (self.version != self.db.version) {
        var setVersionRequest = self.db.setVersion(self.version)
        setVersionRequest.onsuccess = function () {
          self.objectStore = self.db.createObjectStore(self.name, {keyPath: "id"})
          deferred.resolve()
        }

        setVersionRequest.onfailure = function () {
          deferred.fail()
        }
      } else {
        deferred.resolve()
      };
    }

    request.onfailure = function () {
      deferred.fail()
    }

    return deferred
  },

  /**
   * ## Lunr.Store.prototype.all
   * Returns all the items in the current store's database object store.
   *
   * @returns {Lunr.Deferred} a deferred object that will be resolved with the contents of the stores object store.
   */
  all: function () {
    var self = this;
    var deferred = new Lunr.Deferred ()
    var results = []

    var trans = self.db.transaction([self.name], IDBTransaction.READ_WRITE, 0)
    var store = trans.objectStore(self.name)

    var cursorRequest = store.openCursor()
    
    cursorRequest.onsuccess = function (e) {
      if (this.result == null) {
        deferred.resolve(results)
        // callback.call(results, results)
        return
      }
    
      results.push(this.result.value)
      this.result.continue()
    }

    cursorRequest.onerror = function (e) {
      deferred.fail()
      console.log("ERROR")
    }

    return deferred
  },

  /**
   * ## Lunr.Store.prototype.destroy
   * Removes the item, with the passed id, from the stores object store.
   *
   * @param {String || Number} id - the id of the object to remove from the store
   * @returns {Lunr.Deferred} a deferred object that will be resolved when the object has been removed from the store
   */
  destroy: function (id) {
    var self = this
    var deferred = new Lunr.Deferred ()

    var trans = self.db.transaction([self.name], IDBTransaction.READ_WRITE, 0)
    var store = trans.objectStore(self.name)

    var request = store.delete(id)

    request.onsuccess = function (e) {
      deferred.resolve(this.result)
    }

    request.onerror = function (e) {
      deferred.fail()
    }

    return deferred
  },

  /**
   * ## Lunr.Store.prototype.destroyAll
   * Removes every object from the stores object store.
   *
   * @returns {Lunr.Deferred} a deferred object that will be resolved once the object store is empty.
   */
  destroyAll: function () {
    var self = this
    var returnDeferred = new Lunr.Deferred ()

    this.all().then(function (objs) {
      if (objs.length) {
        new Lunr.Deferred (objs.map(function (obj) {
          return self.destroy(obj.id)
        })).then(function () {
          returnDeferred.resolve()
        })
      } else {
        returnDeferred.resolve()
      };
    })

    return returnDeferred
  },

  /**
   * ## Lunr.Store.prototype.find
   * Finds an object in the store's object store with the passed id.
   *
   * @param {String || Number} id - the id of the object to be found in the object store.
   * @returns {Lunr.Deferred} a deferred object that will be resolved with the found object.
   */
  find: function (id) {
    var self = this
    var deferred = new Lunr.Deferred ()

    var trans = self.db.transaction([self.name], IDBTransaction.READ_WRITE, 0)
    var store = trans.objectStore(self.name)

    var request = store.get(id)

    request.onsuccess = function (e) {
      deferred.resolve(this.result)
    }

    request.onerror = function (e) {
      deferred.fail()
    }

    return deferred
  },

  /**
   * ## Lunr.Store.prototype.save
   * Saves the passed object into the object store.  Any existing object with the same id will be overwriten.
   *
   * @param {Object} object - the object to store in the object store.
   * @returns {Lunr.Deferred} a deferred object that will be resolved when the object has been saved.
   */
  save: function (object) {
    var self = this
    var deferred = new Lunr.Deferred ()

    var trans = self.db.transaction([self.name], IDBTransaction.READ_WRITE, 0)
    var store = trans.objectStore(self.name)

    var request = store.put(object)

    request.onsuccess = function () {
      deferred.resolve()
    }

    request.onerror = function (e) {
      deferred.fail()
    }

    return deferred
  }
}