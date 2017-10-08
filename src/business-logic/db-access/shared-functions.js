import { ObjectId } from "mongodb";

export const prepare = o => {
  o._id = o._id.toString();
  return o;
};

export const editById = async (_id, collection, update) => {
  await collection.findOneAndUpdate(ObjectId(_id), {
    $set: update
  });
  return prepare(await collection.findOne(ObjectId(_id)));
};

export const deleteById = async (_id, collection) => {
  const res = await collection.findOne({ _id: ObjectId(_id) });
  await collection.deleteOne({ _id: ObjectId(_id) });
  return res;
};
