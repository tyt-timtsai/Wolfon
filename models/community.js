const db = require('../utils/db');

async function get(id) {
  const result = await db.community.findOne({ id });
  return result;
}

async function search(keyword) {
  const result = await db.community.find({ name: { $regex: keyword } }).toArray();
  return result;
}

async function create(communityData, userId) {
  const result = await db.community.insertOne(communityData);
  await db.users.updateOne({ id: userId }, { $addToSet: { community: communityData.id } });
  return result;
}

async function apply(communityId, userId) {
  const result = await db.community.updateOne(
    { id: communityId },
    { $addToSet: { applicant: userId } },
  );
  await db.users.updateOne({ id: userId }, { $addToSet: { apply_community: communityId } });
  return result;
}

async function confirmApply(communityId, userId) {
  const result = await db.community.updateOne(
    { id: communityId },
    { $addToSet: { users: userId }, $pull: { applicant: userId } },
  );
  await db.users.updateOne(
    { id: userId },
    {
      $addToSet: { community: communityId },
      $pull: { apply_community: communityId },
    },
  );
  return result;
}

module.exports = {
  get, search, create, apply, confirmApply,
};
