const { exec } = require('child_process');
const fs = require('fs');

function createProcess(command) {
    return new Promise((resolve, reject) => {

        let child = exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }

            resolve(stdout);
        });

        child.stdout.on('data', data => {
            console.log(data);
        });

        child.stderr.on('data', data => {
            console.log(data);
        });

    });
}

function patch() {
    let packageJSON = JSON.parse(fs.readFileSync('./package.json'));
    let versions = packageJSON.version.split('.');
    versions[2]++;
    packageJSON.version = versions.join('.');

    fs.writeFileSync('./package.json', JSON.stringify(packageJSON));

    return packageJSON;
}

(async function() {

    try {
        let version = patch().version + '-alpha';
        await createProcess('npm i');
        await createProcess(`docker build -t vradchenko/node_mini_ci:${version} .`);
        await createProcess(`docker build -t vradchenko/node_mini_ci:latest .`);
        await createProcess(`docker push vradchenko/node_mini_ci:${version}`);
        await createProcess(`docker push vradchenko/node_mini_ci:latest`);
        await createProcess('npm publish');

        console.log('Published! :)');

    } catch (error) {
        console.error(error);
        process.exit(1);
    }

})();