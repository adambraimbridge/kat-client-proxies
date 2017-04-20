'use strict';

const proxies = require('./../index');
const expect = require('chai').expect;
const mocks = require('./helpers/mocks');
const config = require('./../lib/helpers/config');
const sinon = require('sinon');
const logger = require('@financial-times/n-logger').default;
const clientErrors = proxies.clientErrors;
const env = require('./helpers/env');
const mockAPI = env.USE_MOCK_API;
const baseUrl = config.myFTURL;
const fetchOpt = Object.assign({}, config.fetchOptions);
fetchOpt.headers = Object.assign({}, fetchOpt.headers, {"X-API-KEY": config.myFTKey});

describe('Status Error Parser', () => {
  let logMessageStub;
  const logMessages = [];

  before(done => {
    if (mockAPI) {
      mocks.registerClientErrors();
    }

    logMessageStub = sinon.stub(logger, 'log').callsFake((...params) => {
      logMessages.push(params);
    });

    done();
  });

  after(done => {
    if (mockAPI) {
      require('nock').cleanAll();
    }

    logMessageStub.restore();

    done();
  });

  describe('NotAuthorisedError', () => {

    it('Should throw an NotAuthorisedError without any headers', done => {
      fetch(baseUrl)
        .then(res => {
          clientErrors.parse(res);

          done(new Error('Should have thrown an exception'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceof(clientErrors.NotAuthorisedError);

          done();
        })
        .catch(done);
    });

    it('Should throw an NotAuthorisedError without an X-API-KEY', done => {
      fetch(baseUrl, config.fetchOptions)
        .then(res => {
          clientErrors.parse(res);

          done(new Error('Should have thrown an exception'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceof(clientErrors.NotAuthorisedError);

          done();
        })
        .catch(done);
    });

    it('Should throw an NotAuthorisedError with an invalid X-API-KEY', done => {
      fetch(baseUrl, { headers: {'X-API-KEY': mocks.uuids.invalidKey }} )
        .then(res => {
          clientErrors.parse(res);

          done(new Error('Should have thrown an exception'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceof(clientErrors.NotAuthorisedError);

          done();
        })
        .catch(done);
    });

    it('Should not throw an NotAuthorisedError with a valid X-API-KEY', done => {
      fetch(baseUrl, fetchOpt)
        .then(res => {
          try {
            clientErrors.parse(res);
          } catch (err) {
            expect(err).to.not.be.an.instanceof(clientErrors.NotAuthorisedError);
          }

          done();
        })
        .catch(done);
    });

  });

  describe('NotFoundError', () => {

    it("Should throw an NotFoundError when something doesn't exist", done => {
      fetch(`${baseUrl}/doesNotExist`, fetchOpt)
        .then(res => {
          clientErrors.parse(res);

          done(new Error('Should have thrown an exception'));
        })
        .catch(err => {
          expect(err).to.be.an.instanceof(clientErrors.NotFoundError);

          done();
        })
        .catch(done);
    });

  });

  if (mockAPI) {
    describe('BadRequestError', () => {
      it('Should throw an BadRequestError', done => {
        fetch(`${baseUrl}/invalidPath`, fetchOpt)
          .then(res => {
            clientErrors.parse(res);

            done(new Error('Should have thrown an exception'));
          })
          .catch(err => {
            expect(err).to.be.an.instanceof(clientErrors.BadRequestError);

            done();
          })
          .catch(done);
      });
    });

    describe('InternalServerError', () => {
      it('Should throw an InternalServerError', done => {
        fetch(`${baseUrl}/serverError`, fetchOpt)
          .then(res => {
            clientErrors.parse(res);

            done(new Error('Should have thrown an exception'));
          })
          .catch(err => {
            expect(err).to.be.an.instanceof(clientErrors.InternalServerError);

            done();
          })
          .catch(done);
      });
    });

    describe('BadGatewayError', () => {
      it('Should throw an BadGatewayError', done => {
        fetch(`${baseUrl}/badGateway`, fetchOpt)
          .then(res => {
            clientErrors.parse(res);

            done(new Error('Should have thrown an exception'));
          })
          .catch(err => {
            expect(err).to.be.an.instanceof(clientErrors.BadGatewayError);

            done();
          })
          .catch(done);
      });
    });

    describe('ServiceUnavailableError', () => {
      it('Should throw an ServiceUnavailableError', done => {
        fetch(`${baseUrl}/serviceUnavailable`, fetchOpt)
          .then(res => {
            clientErrors.parse(res);

            done(new Error('Should have thrown an exception'));
          })
          .catch(err => {
            expect(err).to.be.an.instanceof(clientErrors.ServiceUnavailableError);

            done();
          })
          .catch(done);
      });
    });

    describe('RedirectionError', () => {
      it('Should throw an RedirectionError', done => {
        fetch(`${baseUrl}/redirect`, fetchOpt)
          .then(res => {
            clientErrors.parse(res);

            done(new Error('Should have thrown an exception'));
          })
          .catch(err => {
            expect(err).to.be.an.instanceof(clientErrors.RedirectionError);

            done();
          })
          .catch(done);
      });
    });

    describe('ClientError', () => {
      it('Should throw an ClientError', done => {
        fetch(`${baseUrl}/clientError`, fetchOpt)
          .then(res => {
            clientErrors.parse(res);

            done(new Error('Should have thrown an exception'));
          })
          .catch(err => {
            expect(err).to.be.an.instanceof(clientErrors.ClientError);

            done();
          })
          .catch(done);
      });
    });

    describe('ServerError', () => {
      it('Should throw an ServerError', done => {
        fetch(`${baseUrl}/otherServerError`, fetchOpt)
          .then(res => {
            clientErrors.parse(res);

            done(new Error('Should have thrown an exception'));
          })
          .catch(err => {
            expect(err).to.be.an.instanceof(clientErrors.ServerError);

            done();
          })
          .catch(done);
      });
    });
  }
});
