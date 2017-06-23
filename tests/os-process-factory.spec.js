const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const OSProcessFactory = require('../application/factories/os-process-factory');
const rootProtocol = require('../application/connection/root-protocol');

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

const COMMAND = 'ls';

describe('Manage OSProcessFactory', () => {
    let osProcessFactory = null;

    beforeEach(() => {
        sinon.stub(rootProtocol, 'getClientProtocol').callsFake(
            () => {
                return {
                    statistic: () => {
                    }
                };
            }
        );

        osProcessFactory = new OSProcessFactory('.', '.');
    });

    afterEach(() => {
        osProcessFactory = null;
        rootProtocol.getClientProtocol.restore();
    });

    it('should create 3 processes', done => {

        let process1 = osProcessFactory.createProcess(COMMAND);
        let process2 = osProcessFactory.createProcess(COMMAND);
        let process3 = osProcessFactory.createProcess(COMMAND);

        expect(Object.keys(osProcessFactory.processRegestry).length).to.equal(3);

        Promise.all([
            process1.wait(),
            process2.wait(),
            process3.wait(),
        ])
            .then(() => {
                done();
            })

    });

});