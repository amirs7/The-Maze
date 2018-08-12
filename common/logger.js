function print(type, message) {
  console.log(`[${type}]: ${message}`);
}

module.exports = {
  error(message) {
    print('ERROR', message);
  },
  warning(message) {
    print('WARNING', message);
  },
  info(message) {
    print('INFO', message);
  }
};
