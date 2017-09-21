'use strict';

const proxies = require('./../index');
const myFT = proxies.myFTClient;
const uuids = require('./mocks/uuids');
const expect = require('chai').expect;
const sinon = require('sinon');
const nock = require('nock');
const logger = require('@financial-times/n-logger').default;
const config = require('./../lib/helpers/config');
const clientErrors = proxies.clientErrors;
const env = require('./helpers/env');
const mockAPI = env.USE_MOCK_API;
const expectOwnProperties = require('./helpers/expectExtensions').expectOwnProperties;
const baseUrl = config.MYFT_API_URL;
const extraParams = `?noEvent=${config.MYFT_NO_EVENT}&waitForPurge=${config.MYFT_WAIT_FOR_PURGE_ADD}`;
const syncUserFollowers = proxies.syncUserFollowers;

const myftConst = config.myftClientConstants;
const suppressLogs = false; //for local test if you want logs when test are run

//TODO spec out tests for syncUserFollowers
describe.only('syncUserFollowers', () => {
  // let logMessageStub;
  // const logMessages = [];

  before(done => {
    // if(suppressLogs) {
    //   logMessageStub = sinon.stub(logger, 'log').callsFake((...params) => {
    //     logMessages.push(params);
    //   });
    // }

    done();
  });

  afterEach(done => {
      nock.cleanAll();
      done();
  });

  after(done => {


    // if(suppressLogs) {
    //   logMessageStub.restore();
    // }
    done();
  });

  const groupId = '00000000-0000-0000-0000-000000000123';
  const uuid = '00000000-0000-0000-0000-000000000001';

  //Happy empyty path
  it('should return status synchronisationIgnored and reason noGroupConceptsToFollow in object for no topics', (done)=> {

    nock(baseUrl)
      .get(`/group/${groupId}/followed/concept`)
      .query(true)
      .reply(200, () => []);

    syncUserFollowers(groupId, uuid).then(res => {
      console.log(res);
      expect(res).to.be.an('object');
      expect(res).to.have.deep.property('user.status', 'synchronisationIgnored');
      expect(res).to.have.deep.property('user.reason', 'noGroupConceptsToFollow');
      done();
    }).catch(done);

  });

  xit('should return synchronisationIgnored if there are no topics to follow', (done)=> {

    syncUserFollowers(groupId, uuid).then(res => {
      console.log(res);
      done();
    }).catch(done);

  });
});