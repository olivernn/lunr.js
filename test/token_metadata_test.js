module("lunr.TokenMetadata")

test('getting and setting values', function () {
  var metadata = new lunr.TokenMetadata,
      key = 'key'

  metadata.add(key, 1)
  deepEqual(metadata.get(key), [1])

  metadata.add(key, 2)
  deepEqual(metadata.get(key), [1, 2])
})

test('merging', function () {
  var metadata = new lunr.TokenMetadata,
      otherMetadata = new lunr.TokenMetadata,
      key = 'key'

  metadata.add(key, 1)
  metadata.add(key, 2)

  otherMetadata.add(key, 1)
  otherMetadata.add(key, 3)

  metadata.merge(otherMetadata)

  deepEqual(metadata.get(key), [1,2,1,3])
})
