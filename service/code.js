const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const fsPromises = fs.promises;

class RunTime {
  constructor(runTime) {
    this.language = runTime.language;
    this.extension = runTime.extension;
    console.log('Create runTime : ', runTime.language);
  }

  async compile(id, code) {
    let log;
    await fsPromises.mkdir(`./code/${id}`, { recursive: true });
    await fsPromises.writeFile(`./code/${id}/code.${this.extension}`, code);

    try {
      const time = 5000;
      setTimeout(() => {
        if (log == null) {
          exec(`docker kill ${id}`);
          log = `ERROR : Execute Over Time. \nTime limited : ${time / 1000} seconds.`;
        }
        return '';
      }, time);

      const { stdout } = await exec(
        `docker run \
        --name ${id} \
        --cpus=".25" \
        --memory=10m \
        --memory-swap=0 \
        -v $(pwd)/code/${id}:/code \
        --rm runtime-${this.language}`,
      );
      return stdout;
    } catch (error) {
      if (error.stdout) {
        log = error.stdout;
      }
      if (error.stderr) {
        log += error.stderr;
      }
      return log;
    } finally {
      await fsPromises.rm(`./code/${id}/code.${this.extension}`);
      await fsPromises.rmdir(`./code/${id}`);
    }
  }
}

const languageStrategies = {
  javascript: {
    language: 'javascript',
    extension: 'js',
  },
  golang: {
    language: 'golang',
    extension: 'go',
  },
  python: {
    language: 'python',
    extension: 'py',
  },
};

// strategy or factory
const runTimeFactory = {
  javascript: new RunTime(languageStrategies.javascript),
  golang: new RunTime(languageStrategies.golang),
  python: new RunTime(languageStrategies.python),
};

function randomContainerId() {
  return `${`${Date.now()}`.slice(6, -1)}-${Math.floor(Math.random() * 100)}`;
}

module.exports = { runTimeFactory, randomContainerId };
