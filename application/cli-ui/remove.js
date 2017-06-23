const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const fs = require('fs');
const path = require('path');

const SESSION_FILE_PATH = path.resolve(__dirname, '..', '..', 'session.dat');

module.exports = async function remove() {

    let session = JSON.parse(fs.readFileSync(SESSION_FILE_PATH));
    let jobs = fs.readdirSync(path.resolve(session.nodeCIHome, 'jobs'))
        .filter(jobName => {
            if (/.json$/.test(jobName)) {
                return true;
            }

            return false;
        });

    let questions = [
        {
            message: 'Jobs to remove',
            required: true,
            name: 'jobs',
            type: 'checkbox',
            choices: jobs
        }
    ];

    return prompt(questions);
};


