const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const prompt = inquirer.createPromptModule();

let questions = [
    {
        message: 'Please enter the job name',
        required: true,
        name: 'name',
        type: 'input',
        validate: value  => {
            if (value) {
                return true;
            } else {
                return 'Job name is required';
            }
        }
    },
    {
        message: 'Please choose the job type',
        required: true,
        name: 'type',
        type: 'list',
        choices: [
          'git-job'
        ],
        default: 'git-job',
    },
    {
        message: 'Please enter a git url (https only)',
        required: true,
        name: 'git_url',
        type: 'input',
        validate: value  => {
            if (/^https:\/\/.*/.test(value)) {
                return true;
            } else {
                return 'https only';
            }
        }
    },
    {
        message: 'Please enter a git remote (origin is default)',
        required: true,
        name: 'git_remote',
        type: 'input',
        default: 'origin'
    },
    {
        message: 'Please enter a git branch (master is default)',
        required: true,
        name: 'git_branch',
        type: 'input',
        default: 'master'
    },
    {
        message: 'Please enter a git password',
        name: 'git_password',
        type: 'password',
    },
    {
        message: 'Please enter the job check interval in milliseconds',
        required: true,
        name: 'interval',
        type: 'input',
        default: '5000',
        validate: value  => {
            if (!!parseInt(value)) {
                return true;
            } else {
                return 'Only numbers are allowed';
            }
        }
    },
    {
        message: 'Please enter the job action scripts ; as delimiter (example: npm install; npm run build)',
        required: true,
        name: 'scripts',
        type: 'input'
    },
];

function createJob(answers) {
    let scripts = answers.scripts.split(';')
        .map(script => {
            return script.trim();
        });

    let job = {
        name: answers.name,
        type: answers.type,
        git: {
            url: answers.git_url,
            remote: answers.git_remote,
            branch: answers.git_branch,
        },
        scripts,
        schedule: {
            interval: +answers.interval
        }
    };

    if (answers.git_password) {
        job.git.git_password = answers.git_password
    }

    return job;
}

module.exports = function ask() {
    return new Promise(async (resolve, reject) => {
        try {
            let job = createJob(await prompt(questions));
            resolve(job);
        } catch (error) {
            reject(error);
        }

    });
};

