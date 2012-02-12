# Lunr

A bit like Solr, but much smaller and not as bright.

## Example

Go to [http://olivernn.github.com/lunr.js/example.html](http://olivernn.github.com/lunr.js/example.html).  There are adaptors already for [JS-Model](http://benpickles.github.com/js-model/) & [Backbone](http://documentcloud.github.com/backbone/).  You can also see an example of the search working in the now traditional 'Todo' [demo app](http://olivernn.github.com/lunr.js/example/backbone) for backbone

## Description

A very simple, client side, full-text search engine for JSON documents.  Can index and search large amounts of data quickly and efficiently.

This is a young library, the API and implementation is open to change.  Any feedback is welcome and appreciated, issues should be raised for any bugs or feature requests.

## Why

Search is something usually handled by a server, by being able to offer some kind of full text search on the client we can make sure that the user can search, even when they are not connected to the internet.  It also means one less service to keep running on your server.

## Installation

Include the lunr.js file in your page.

## Todo

Currently this is in the early stages of development, however I have the following plans:

* More efficient storage of the search index.
* Make the search index persistable.
* Allow for the use of other language based algorithms, e.g. metaphoning.
* Allow for the use of other languages, not everyone speaks English!
* Build a server side implementation with Node.js
* Add adaptors for other popular JavaScript frameworks, e.g. Ember & Spine.
