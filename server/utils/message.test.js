const expect = require('expect');

var {generateMessage} = require('./message')

describe('generateMessage', () => {
  it('should generate the correct message', () => {
    var res = generateMessage('Max', 'Test');

    expect(res.from).toBe('Max');
    expect(res.text).toBe('Test');
    expect(res.createdAt).toBeLessThan(new Date().getTime());
  });
});
