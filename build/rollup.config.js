
export default {
  input: 'lunr.js',
  output: [
    {
      file: 'lunr.js',
      format: 'umd',
      name: 'lunr'
    },
    {
      file: 'lunr.es6.js',
      format: 'esm'
    }
  ]
};