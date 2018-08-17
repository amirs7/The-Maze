module.exports = {
  'extends': 'airbnb-base',
  'rules': {
    'comma-dangle': 0,
    'no-console': 0,
    'curly': 0,
    'nonblock-statement-body-position': 0,
    'no-plusplus': 0,
    'new-cap': 0,
    'prefer-destructuring': 0,
    'mocha/no-exclusive-tests': 'error'
  },
  'plugins': [
    'mocha'
  ],
  'env': {
    'mocha': true,
    'node': true
  }
};