const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const fsPromises = fs.promises;
const extensionMap = {
  javascript: 'js',
  golang: 'go',
  python: 'py',
};

class RunTime {
  constructor(language) {
    this.language = language;
    this.extension = extensionMap[language];
    console.log('Create runTime : ', language);
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
          log = `ERROR : Execute Over Time. \nTime limited : ${time / 1000} second.`;
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

const runTimeAdapter = {
  javascript: new RunTime('javascript'),
  golang: new RunTime('golang'),
  python: new RunTime('python'),
};

function randomContainerId() {
  return `${`${Date.now()}`.slice(6, -1)}-${Math.floor(Math.random() * 100)}`;
}

module.exports = { runTimeAdapter, randomContainerId };
