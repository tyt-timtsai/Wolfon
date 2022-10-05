const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Code = require('../models/code');

const fsPromises = fs.promises;

const extensionMap = {
  javascript: 'js',
  golang: 'go',
  python: 'py',
};

function createRandomId() {
  return `${`${Date.now()}`.slice(6, -1)}-${Math.floor(Math.random() * 100)}`;
}

async function compile(req, res) {
  const { language, code } = req.body;
  const id = createRandomId();

  let log;
  const extension = extensionMap[language];

  if (!extension) {
    return res.status(400).send('Not support language');
  }

  await fsPromises.mkdir(`./code/${id}`, { recursive: true });
  await fsPromises.writeFile(`./code/${id}/code.${extension}`, code);

  try {
    // catch time out & while (true) case
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
      --rm runtime-${language}`,
    );

    log = stdout;

    console.log('Compile finished.');
    return res.status(200).send(log);
  } catch (error) {
    console.log('compile error : ', error);

    if (error.stdout) {
      log = error.stdout;
    }
    if (error.stderr) {
      log += error.stderr;
    }

    return res.status(200).send(log);
  } finally {
    await fsPromises.rm(`./code/${id}/code.${extension}`);
    await fsPromises.rmdir(`./code/${id}`);
  }
}

async function addVersion(req, res) {
  let result;
  const { tag, code, language } = req.body;
  const schema = await Code.get(req.params.id);
  if (schema == null) {
    console.log('version not exist');

    const codeData = {
      room: req.params.id,
      language,
      tags: [
        {
          tag,
          code,
          child: [],
        },
      ],
    };

    result = await Code.create(codeData);
  } else {
    console.log('version exist');

    // Duplicate case
    const existTag = await Code.getTag(req.params.id, tag);
    if (existTag.length > 0) {
      return res.status(400).json({ status: 400, message: 'Duplicate tag' });
    }

    result = await Code.add(req.params.id, tag, code, req.body.from || null);
    if (req.body.from) {
      await Code.addChild(req.params.id, req.body.from, tag);
    }
  }
  return res.status(200).json({ status: 200, message: 'success', result });
}

async function getVersion(req, res) {
  let data;
  if (req.query.tag) {
    data = await Code.getTag(req.params.id, req.query.tag);
  } else {
    console.log('Get all versions');
    data = await Code.getAll(req.params.id);
  }
  return res.status(200).json({ status: 200, message: 'success', data });
}

module.exports = { compile, addVersion, getVersion };
