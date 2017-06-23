const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const OSProcess = require('../application/entities/os-process');

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

const COMMAND = 'ls';

describe('Manage osProcess', () => {
    let osProcess = null;

    beforeEach(() => {

    });

    afterEach(() => {

    });

    it('should be created', done => {
        let osProcess = new OSProcess(COMMAND, '.');
        osProcess.should.have.property('pid');
        osProcess.should.have.property('terminate');
        osProcess.pid.should.not.equal(0);
        osProcess.wait()
            .then(() => {
                done();
            });
    });

    it('should be terminated', done => {
        osProcess = new OSProcess(COMMAND, '.');

        osProcess.on('exit', processData => {
            expect(processData.pid).to.equal(null);

            done();
        });

        osProcess.terminate();

        osProcess.wait()
            .then(() => {});


    });

    it('should transfer stdout data', done => {
        osProcess = new OSProcess(COMMAND, '.');
        let stdout = '';

        osProcess.on('data', data => {
            stdout += data;
        });

        osProcess.wait()
            .then(() => {
                stdout.should.not.be.equal('');
                done();
            });
    });
});