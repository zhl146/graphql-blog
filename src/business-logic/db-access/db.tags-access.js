import { ObjectId } from "mongodb";

import { editById, deleteById, prepare } from "./shared-functions";

export const getTags = async (root, args, { Tags }) =>
  (await Tags.find({}).toArray()).map(prepare);

export const getTagsByPost = async ({ tags }, args, { Tags }) =>
  Promise.all(
    tags.map(async tagId => prepare(await Tags.findOne(ObjectId(tagId))))
  );

export const createTag = async (root, { content }, { Tags }) => {
  const res = await Tags.insertOne({ content });
  return prepare(await Tags.findOne({ _id: res.insertedId }));
};

export const editTag = async (root, { _id, content }, { Tags }) =>
  editById(_id, Tags, { content });

export const deleteTag = async (root, { _id }, { Tags }) =>
  deleteById(_id, Tags);
