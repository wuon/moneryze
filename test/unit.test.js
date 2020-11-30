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
        amount: 12.98,
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
      const cust_id = 'Cust1';
      const res = await moneris.resAddCC({
        pan: '4242424242424242',
        expdate: '2011',
        cust_id,
        phone: '0000000000',
        email: 'bob@bob.com',
        description: 'register',
      });
      const ref = await moneris.independentRefundWithVault({
        cust_id,
        amount: 0.1,
        token: res.data.dataKey,
        order_id: `Test${now.getTime()}`,

      });
      expect(ref).to.be.a('object');
      expect(ref).to.have.property('isSuccess');
      expect(ref.isSuccess).to.be.a('boolean');
      expect(ref.isSuccess).true;
      expect(ref).to.have.property('msg');
      expect(ref.msg).to.be.a('string');
      expect(ref).to.have.property('data');
      expect(ref.data).to.be.a('object');
    });
  });

  describe('moneris.kountInquire', () => {
    it('Should return an incomplete score', async () => {
      const res = await moneris.kountInquire({
        kount_merchant_id: '760000',
        kount_api_key: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI3NjAwMDAiLCJhdWQiOiJLb3VudC4xIiwiaWF0IjoxNTU4MDQwODQ5LCJzY3AiOnsia2EiOm51bGwsImtjIjpmYWxzZSwiYXBpIjp0cnVlLCJyaXMiOnRydWV9fQ.y3_2yzd11-Y_F6_xzVsXI-NO1a7P6ldMjDnKzl5yBko', // 214 character max - This is a UNIQUE local identifier used by the merchant to identify the kount inquiry request
        order_id: 'nqa-orderidkount-1-gab-1',
        call_center_ind: 'n',
        currency: 'CAD',
        email: 'gsierra@lenordik.com',
        auto_number_id: 'NQA-X1',
        // 'payment_token': '3B1C19fgfRObNHaQh5qVCpRW2',
        payment_token: '4242424242424242',
        payment_type: 'CARD',
        ip_address: '192.168.2.1',
        session_id: 'xjudq804i1049jkjakdad',
        website_id: 'DEFAULT',
        amount: 100,
        avs_response: 'M',
        cvd_response: 'M',
        prod_type_1: 1,
        prod_item_1: 'massage',
        prod_desc_1: 'Massage 1',
        prod_quant_1: '1',
        prod_price_1: '100',
      });
      expect(res).to.be.a('object');
      expect(res).to.have.property('isSuccess');
      expect(res.isSuccess).to.be.a('boolean');
      expect(res.isSuccess).to.eql(true);
      expect(res).to.have.property('msg');
      expect(res.msg).to.be.a('string');
      expect(res.msg).to.eql('Success');
      expect(res).to.have.property('data');
      expect(res.data).to.be.a('object');
      expect(res.data).to.have.property('kountInfo');
      expect(res.data.kountInfo).to.be.a('object');
      expect(res.data).to.have.property('kountResult');
      expect(res.data.kountResult).to.eql('A');
      expect(res.data).to.have.property('kountScore');
      expect(res.data.kountScore).to.eql('71');
      expect(res.data).to.have.property('kountTransactionId');
      expect(res.data.kountTransactionId).to.not.be.a('null');
      expect(res.data).to.have.property('receipt');
      expect(res.data.receipt).to.not.be.a('null');
      expect(res.data.receipt).to.eql('nqa-orderidkount-1-gab-1');
    });
  });
});
