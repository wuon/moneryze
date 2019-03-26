const chai = require('chai');

const { expect } = chai;
const moneris = require('../index');

chai.use(require('chai-as-promised'));

describe('Unit Testing', () => {
  describe('moneris.init()', () => {
    it('should receive a rejected promise with an error', () => {
      const res = moneris.resAddCC({
        pan: '4242424242424242',
        expdate: '2011',
      });
      expect(res).to.be.rejectedWith(Error);
    });
    it('should reject the promise with insufficient info', () => {
      const res = moneris.init({
      });
      expect(res).to.be.rejectedWith(Error);
    });
    it('should reject the promise with insufficient info', () => {
      const res = moneris.init({
        app_name: 'Test',
        crypt_type: '7',
        test: true,
      });
      expect(res).to.be.rejectedWith(Error);
    });
    it('should fulfill the promise with no response', () => {
      const res = moneris.init({
        app_name: 'Test',
        store_id: 'store5',
        api_token: 'yesguy',
        crypt_type: '7',
        test: true,
      });
      expect(res).to.be.fulfilled;
    });
  });
  describe('moneris.redAddCC()', () => {
    it('should receive an object with the following parameters', () => {
      moneris.resAddCC({
        pan: '4242424242424242',
        expdate: '2011',
      }).then((res) => {
        expect(res).to.be.a('object');
        expect(res).to.have.property('isSuccess');
        expect(res.isSuccess).to.be.a('boolean');
        expect(res.isSuccess).true;
        expect(res).to.have.property('code');
        expect(res.code).to.be.a('string');
        expect(res).to.have.property('msg');
        expect(res.msg).to.be.a('string');
        expect(res).to.have.property('data');
        expect(res.data).to.be.a('object');
      });
    });
  });
});
