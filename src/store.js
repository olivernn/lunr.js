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

Search.Store = function (name) {
  this.name = name
  this.version = "1"
}

Search.Store.prototype = {
  init: function (callback) {
    var self = this
    var request = indexedDB.open(this.name, "")
    request.onsuccess = function (e) {
      self.db = this.result

      if (self.version != self.db.version) {
        var setVersionRequest = self.db.setVersion(self.version)
        setVersionRequest.onsuccess = function () {
          self.objectStore = self.db.createObjectStore(self.name, {keyPath: "id"})
          if (callback) callback()
          console.log('success init')
        }

        setVersionRequest.onfailure = function () {
          console.log("init fail")
        }
      } else {
        console.log('init success')
      };
    }

    request.onfailure = function () {
      console.log("init fail")
    }
  },

  all: function () {
    var self = this;
    var deferred = new Search.Deferred ()
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

  destroy: function (id) {
    var self = this
    var deferred = new Search.Deferred ()

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

  destroyAll: function () {
    var self = this
    var returnDeferred = new Search.Deferred ()

    this.all().then(function (objs) {
      new Search.Deferred (objs.map(function (obj) {
        return self.destroy(obj.id)
      })).then(function () {
        returnDeferred.resolve()
      })
    })

    return returnDeferred
  },

  find: function (id) {
    var self = this
    var deferred = new Search.Deferred ()

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

  save: function (object) {
    var self = this
    var deferred = new Search.Deferred ()

    var trans = self.db.transaction([self.name], IDBTransaction.READ_WRITE, 0)
    var store = trans.objectStore(self.name)

    var request = store.put(object)

    request.onsuccess = function () {
      // callback()
      deferred.resolve()
    }

    request.onerror = function (e) {
      console.log('save error', e)
      deferred.fail()
    }

    return deferred
  }
}