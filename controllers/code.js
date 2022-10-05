const Code = require('../models/code');
const { randomContainerId, runTimeFactory } = require('../service/code');

async function compile(req, res) {
  const id = randomContainerId();
  const { language, code } = req.body;
  const program = runTimeFactory[language];

  // Not support language
  if (!program.extension) {
    return res.status(400).send('Not support language');
  }

  // Inspect compile on over time case
  const log = await program.compile(id, code);
  console.log('Compile finished.');
  return res.status(200).send(log);
}

async function addVersion(req, res) {
  let result;
  const { tag, code, language } = req.body;
  const schema = await Code.get(req.params.id);

  // New version
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
    // Find duplicate
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
