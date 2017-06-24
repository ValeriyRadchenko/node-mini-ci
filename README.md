# Node Mini CI Server

## Prerequisites
* Git installed
* NodeJS 8+ installed
* NPM installed
* Docker installed

## How to use

  Install it as a global module:
  
  `npm install -g node-mini-ci`

  
  And run this command in your terminal

    `node-mini-ci`

### Add a job

    `node-mini-ci --add [-a]`

### Remove a job

    `node-mini-ci --remove [-r]`

### Stop node-mini-ci demonized process

    `node-mini-ci --stop [-s]`

### Run node-mini-ci in debug mode

    `node-mini-ci --debug [-d] --verbose [-v]`

### Using with Docker:
  - create a folder(`<YOUR_DIRECTORY>`) on your server;
  - run `docker run -ti -v <YOUR_DIRECTORY>:/var/node_mini_ci_home vradchenko/node_mini_ci`;
  - set up your job, use `job-example.json` as an template;
  - copy your job to `<YOUR_DIRECTORY>/jobs`.


### Default node-mini-ci home directory

Default node-mini-ci home directory is `<YOUR_OS_HOME_DIRECTORY>/node-ci`

### Logs
You can find log file in a `<YOUR_OS_HOME_DIRECTORY>/node-ci` folder.

[Docker Hub](https://hub.docker.com/r/vradchenko/node_mini_ci/)