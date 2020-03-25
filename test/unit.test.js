const chai = require('chai');

const { expect } = chai;
const moneris = require('../index');

chai.use(require('chai-as-promised'));

let token;
let orderId;
let txnNumber;

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
        country_code: 'CA'
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
      orderId = res.data.receipt;
      txnNumber = res.data.id;
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
  describe('moneris.purchase()', () => {
    it('should receive an object with the following parameters and declined', async () => {
      const purchasePayload = {
        order_id: `OR-1${new Date()}`, amount: '0.02', pan: 4242424242424242, expdate: 2504, description: 'Nordik online reservation',
      };
      const res = await moneris.purchase(purchasePayload);
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
      const purchasePayload = {
        order_id: `OR-1${new Date()}`, amount: '0.08', pan: 4242424242424242, expdate: 2504, description: 'Nordik online reservation',
      };
      const res = await moneris.purchase(purchasePayload);
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
  describe('moneris.refund()', () => {
    it('should receive an object with the following parameters and failed', async () => {
      const res = await moneris.refund({
        txn_number: txnNumber,
        order_id: orderId,
        amount: 12.98
      });
      expect(res).to.be.a('object');
      expect(res).to.have.property('isSuccess');
      expect(res.isSuccess).to.be.a('boolean');
      expect(res.isSuccess).false;
      expect(res).to.have.property('msg');
      expect(res.msg).to.be.a('string');
      expect(res).to.have.property('data');
      expect(res.data).to.be.a('object');
    });
    it('should receive an object with the following parameters', async () => {
      const res = await moneris.refund({
        txn_number: txnNumber,
        order_id: orderId,
        amount: 11.98,
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
    it('should receive an object with the following parameters and failed', async () => {
      const res = await moneris.refund({
        txn_number: txnNumber,
        order_id: orderId,
        amount: 11.98,
      });
      expect(res).to.be.a('object');
      expect(res).to.have.property('isSuccess');
      expect(res.isSuccess).to.be.a('boolean');
      expect(res.isSuccess).false;
      expect(res).to.have.property('msg');
      expect(res.msg).to.be.a('string');
      expect(res).to.have.property('data');
      expect(res.data).to.be.a('object');
    });
  });
  describe('moneris.independentRefundWithVault', () => {
    it('Should refund an amount to a vault credit card', async () => {
      const now = new Date();
      const cust_id = 'Cust1'
      const res = await moneris.resAddCC({
        pan: '4242424242424242',
        expdate: '2011',
        cust_id,
        phone: '0000000000',
        email: 'bob@bob.com',
        description: 'register'
      });
      const ref = await moneris.independentRefundWithVault({
        cust_id,
        amount: 0.1,
        token: res.data.dataKey,
        order_id: `Test${now.getTime()}`,

      })
      expect(ref).to.be.a('object');
      expect(ref).to.have.property('isSuccess');
      expect(ref.isSuccess).to.be.a('boolean');
      expect(ref.isSuccess).true;
      expect(ref).to.have.property('msg');
      expect(ref.msg).to.be.a('string');
      expect(ref).to.have.property('data');
      expect(ref.data).to.be.a('object');
    })
  })
});
