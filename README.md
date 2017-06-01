# Node Mini CI Server

## Warning: *Do not use this in production*

## Prerequisites
* NodeJS 8+ installed
* NPM installed
* Docker installed

## How to use
 - create `<YOUR_HOME_DIRECTORY>/jobs` directory;
 - copy `job-example.json` to `<YOUR_HOME_DIRECTORY>/jobs` folder;
 - put your settings to `job-example.json` and rename it;
 - run `docker run -ti -v <YOUR_HOME_DIRECTORY>:/var/node_mini_ci_home vradchenko/node_mini_ci`

*Now you can add new job files or edit existed, all changes will be applied automatically.*

## Delete a job
 - remove a `<your job name>.json` file from `<YOUR_HOME_DIRECTORY>/jobs` folder and the job will be automatically stopped and removed.

[Link to Docker Hub](https://hub.docker.com/r/vradchenko/node_mini_ci/)