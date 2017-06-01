# Node Mini CI Server

## Prerequisites
* NodeJS 8+ installed
* NPM installed
* Docker installed

## How to use
 - create `<YOUR_HOME_DIRECTORY>/jobs` directory;
 - copy `job-example.json` to `<YOUR_HOME_DIRECTORY>/jobs` folder;
 - put your settings to `job-example.json` and rename it;
 - run `docker run -ti -v <YOUR_HOME_DIRECTORY>:/var/node_mini_ci_home node_mini_ci`

*Now you can add new job files or edit existed, all changes will be applied automatically.*

## Delete a job
 - remove a `<your job name>.json` file from `<YOUR_HOME_DIRECTORY>/jobs` folder and the job will be automatically stopped and removed.

