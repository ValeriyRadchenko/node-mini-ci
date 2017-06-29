const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
const fs = require('fs');
const path = require('path');
const config = require('../../config');

module.exports = async function remove() {

    let jobs = fs.readdirSync(path.resolve(config.homeDir, 'jobs'))
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


