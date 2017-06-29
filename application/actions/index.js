const addJob = require('./add-job');
const removeJob = require('./remove-job');
const stopApplication = require('./stop-application');
const getJobsStatus = require('./status');

exports.addJob = addJob;
exports.removeJob = removeJob;
exports.stopApplication = stopApplication;
exports.getJobsStatus = getJobsStatus;