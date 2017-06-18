const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const OSProcessFactory = require('../application/factories/os-process-factory');

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

describe('Manage OSProcessFactory', () => {
    let osProcessFactory = null;

    beforeEach(() => {
        osProcessFactory = new OSProcessFactory('.', '.');
    });

    afterEach(() => {
        osProcessFactory = null;
    });

    it('should create 3 processes', () => {
       osProcessFactory.createProcess('ls');
       osProcessFactory.createProcess('ls');
       osProcessFactory.createProcess('ls');

       expect(Object.keys(osProcessFactory.processRegestry).length).to.equal(3);

    });

});