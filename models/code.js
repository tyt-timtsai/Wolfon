const db = require('../utils/db');

async function create(codeData) {
  const result = await db.codes.insertOne(codeData);
  return result;
}

async function add(roomId, tag, code, from) {
  const result = await db.codes.updateOne(
    { room: roomId },
    {
      $addToSet: {
        tags: {
          tag,
          from,
          code,
        },
      },
    },
  );
  return result;
}

async function addChild(roomId, tag, childTag) {
  const result = await db.codes.updateOne(
    { room: roomId, 'tags.tag': tag },
    {
      $addToSet: {
        'tags.$.child': childTag,
      },
    },
  );
  return result;
}

async function get(roomId) {
  const result = await db.codes.findOne(
    {
      room: roomId,
    },
    {
      projection: { _id: 0 },
    },
  );
  return result;
}

async function getTag(roomId, tag) {
  const result = await db.codes.aggregate([
    {
      $match: {
        room: roomId,
        'tags.tag': tag,
      },
    },
    {
      $project: {
        room: 1,
        tags: {
          $filter: {
            input: '$tags',
            as: 'tags',
            cond: {
              $eq: ['$$tags.tag', tag],
            },
          },
        },
        code: 1,
        from: 1,
      },
    },
  ]).toArray();
  return result;
}

async function getAll(roomId) {
  const result = await db.codes.findOne({ room: roomId }, { projection: { _id: 0 } });
  return result;
}

module.exports = {
  create, add, addChild, get, getTag, getAll,
};
