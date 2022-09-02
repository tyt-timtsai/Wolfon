const router = require('express').Router();
const fs = require('fs');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

const fsPromises = fs.promises;

router.post('/', async (req, res) => {
  const { language, code } = req.body;
  const id = `${`${Date.now()}`.slice(6, -1)}-${Math.floor(Math.random() * 100)}`;
  let extension;
  let log;

  switch (language) {
    case 'javascript':
      extension = 'js';
      break;
    case 'golang':
      extension = 'go';
      break;
    case 'python':
      extension = 'py';
      break;

    default:
      console.log('default');
      return res.status(400).send('Not support language');
  }

  await fsPromises.mkdir(`./code/${id}`, { recursive: true });
  await fsPromises.writeFile(`./code/${id}/code.${extension}`, code);
  try {
    const { stdout } = await exec(`docker run --name ${id} -v $(pwd)/code/${id}:/code --rm runtime-${language}`);

    log = stdout;

    res.status(200).send(log);

    await fsPromises.rm(`./code/${id}/code.${extension}`);
    await fsPromises.rmdir(`./code/${id}`);

    console.log('end');
  } catch (error) {
    console.log(error.stdout);
    if (error.stdout && error.stderr) {
      log = error.stdout + error.stderr;
    } else {
      log = error.stderr;
    }
    res.status(200).send(log);
  }
});

module.exports = router;
