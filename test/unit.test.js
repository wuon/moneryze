const chai = require('chai');

const { expect } = chai;
const moneris = require('../index');

chai.use(require('chai-as-promised'));

let token;

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
    it('should fulfill the promise with crypt_type set to 7', async () => {
      const config = await moneris.init({
        name: 'Test',
        store_id: 'store5',
        api_token: 'yesguy',
        test: true,
      });
      expect(config).to.have.property('crypt_type');
      expect(config.crypt_type).to.be.a('string');
      expect(config.crypt_type).to.equal('7');
    });
    it('should fulfill the promise with crypt_type set to 4', async () => {
      const config = await moneris.init({
        name: 'Test',
        store_id: 'store5',
        api_token: 'yesguy',
        crypt_type: '4',
        test: true,
      });
      expect(config).to.have.property('crypt_type');
      expect(config.crypt_type).to.be.a('string');
      expect(config.crypt_type).to.equal('4');
    });
    it('should fulfill the promise with default name', async () => {
      const config = await moneris.init({
        store_id: 'store5',
        api_token: 'yesguy',
        crypt_type: '7',
        test: true,
      });
      expect(config).to.have.property('name');
      expect(config.name).to.be.a('string');
      expect(config.name).to.equal('default');
    });
    it('should fulfill the promise with custom name', async () => {
      const config = await moneris.init({
        name: 'custom',
        store_id: 'store5',
        api_token: 'yesguy',
        crypt_type: '7',
        test: true,
      });
      expect(config).to.have.property('name');
      expect(config.name).to.be.a('string');
      expect(config.name).to.equal('custom');
    });
    it('should reject the promise with insufficient info', () => {
      const res = moneris.init({
        name: 'Test',
        crypt_type: '7',
        test: true,
      });
      expect(res).to.be.rejectedWith(Error);
    });
    it('should fulfill the promise', () => {
      const res = moneris.init({
        name: 'Test',
        store_id: 'store5',
        api_token: 'yesguy',
        crypt_type: '7',
        test: true,
        country_code: 'FR',
      });
      expect(res).to.be.rejectedWith(Error);
    });
    it('should fulfill the promise', () => {
      const res = moneris.init({
        name: 'Test',
        store_id: 'store5',
        api_token: 'yesguy',
        crypt_type: '7',
        test: true,
      });
      expect(res).to.be.fulfilled;
    });
  });
  describe('moneris.resAddCC()', () => {
    it('should receive an object with the following parameters', async () => {
      const res = await moneris.resAddCC({
        pan: '4242424242424242',
        expdate: '2011',
      });
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
      token = res.data.dataKey;
    });
  });
  describe('moneris.resUpdateCC()', () => {
    it('should receive an object with the following parameters', async () => {
      const res = await moneris.resUpdateCC({
        token,
        pan: '4242424242424242',
        expdate: '2011',
      });
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
  describe('moneris.resLookupCC()', () => {
    it('should receive an object with the following parameters', async () => {
      const res = await moneris.resLookupMasked({
        token,
      });
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
  describe('moneris.resPurchaseCC()', () => {
    it('should receive an object with the following parameters and declined', async () => {
      const res = await moneris.resPurchaseCC({
        amount: 11.98,
        token,
        description: 'Two drinks',
        test: true,
      });
      expect(res).to.be.a('object');
      expect(res).to.have.property('isSuccess');
      expect(res.isSuccess).to.be.a('boolean');
      expect(res.isSuccess).false;
      expect(res).to.have.property('code');
      expect(res.code).to.be.a('string');
      expect(res).to.have.property('msg');
      expect(res.msg).to.be.a('string');
      expect(res).to.have.property('data');
      expect(res.data).to.be.a('object');
    });
    it('should receive an object with the following parameters', async () => {
      const res = await moneris.resPurchaseCC({
        amount: 11.98,
        token,
        description: 'Two drinks',
      });
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
  describe('moneris.resDelete()', () => {
    it('should receive an object with the following parameters', async () => {
      const res = await moneris.resDelete({
        token,
      });
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
