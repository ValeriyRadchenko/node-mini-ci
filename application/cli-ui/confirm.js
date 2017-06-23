const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();

module.exports = async function confirm(title, example) {
    console.log(title + '\n');
    console.log(example);

    let questions = [
        {
            message: 'Apply changes?',
            name: 'yes',
            type: 'confirm',
        },
    ];

    let answer = await prompt(questions);

    if (answer.yes) {
        return example;
    }

    return false;
};


