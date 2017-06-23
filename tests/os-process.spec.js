const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const OSProcess = require('../application/entities/os-process');

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

describe('Manage osProcess', () => {
    let osProcess = null;

    beforeEach(() => {
        osProcess = new OSProcess('ls', '.');
    });

    afterEach(() => {
        osProcess = null;
    });

    it('should be created', () => {
        osProcess.should.have.property('pid');
        osProcess.should.have.property('terminate');
        osProcess.pid.should.not.equal(0);
    });

    it('should be terminated', done => {
        osProcess.on('exit', processData => {
            expect(processData.pid).to.equal(null);

            done();
        });

        osProcess.wait()
            .catch(() => {});

        osProcess.terminate();
    });
});