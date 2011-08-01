# Lunr

## Description

An experiment in using IndexedDB for a client side full text search engine.

Currently this is very ALPHA and should probably not be used in production.  The API is likely to change.  Any feedback is welcome and appreciated.

## Why

Search is something usually handled by a server, by being able to offer some kind of full text search on the client we can make sure that the user can search, even when they are not connected to the internet.  It also means one less service to keep running on your server.

## Requirements

Currently Search relies on IndexedDB for its index storage.  This means it will only work in the latest versions of Chrome and Firefox, or wherever else IndexedDB is supported.

## Installation

Include the search.js file in your page.

## Todo

Currently this is little more than a prototype.  In the future it could be expanded to work with data stores other than IndexedDB, it could also be made to run on the server with node.js.
