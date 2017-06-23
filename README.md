# Node Mini CI Server

### *NOW IN ALPHA*

## Prerequisites
* Git installed
* NodeJS 8+ installed
* NPM installed
* Docker installed

## How to use

  Install it as a global module:
  
  `npm install -g node-mini-ci`

  
  And run this command in your terminal
   
   On Windows:
    
    `set NODE_CI_HOME=<YOUR_HOME_DIRECTORY> && node-mini-ci -- --verbose`
 
   On Ubuntu:
  
    `export NODE_CI_HOME=<YOUR_HOME_DIRECTORY> && node-mini-ci -- --verbose`


*Now you can add or remove job files and all changes will be applied automatically.*

### Using with Docker:
  - create a folder(`<YOUR_HOME_DIRECTORY>`) on your server;
  - run `docker run -ti -v <YOUR_HOME_DIRECTORY>:/var/node_mini_ci_home vradchenko/node_mini_ci`;
  - set up your job, use `job-example.json` as an template;
  - copy your job to `<YOUR_HOME_DIRECTORY>/jobs`.

## Run as daemon
run `NODE_CI_HOME=<YOUR_HOME_DIRECTORY> && node-mini-ci -- --daemon`;

## Delete a job
 - remove a `<your job name>.json` file from `<YOUR_HOME_DIRECTORY>/jobs` folder and the job will be automatically stopped and removed.
 
## Logs
You can find log file in a `<YOUR_HOME_DIRECTORY>` folder.

[Link to Docker Hub](https://hub.docker.com/r/vradchenko/node_mini_ci/)