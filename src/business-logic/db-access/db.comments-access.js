import { ObjectId } from "mongodb";

import { editById, deleteById, prepare } from "./shared-functions"

export const getCommentById = async (root, { _id }, { Comments }) =>
  prepare(await Comments.findOne(ObjectId(_id)));

export const getCommentsByPostId = async ({ _id }, args, { Comments }) =>
  (await Comments.find({ postId: _id }).toArray()).map(prepare);

export const createComment = async (root, args, { Comments }) => {
  const res = await Comments.insertOne(args);
  return prepare(await Comments.findOne({ _id: res.insertedId }));
};

export const editComment = async (root, { _id, content }, { Comments }) =>
  editById(_id, Comments, { content });

export const deleteComment = async (root, { _id }, { Comments }) =>
  deleteById(_id, Comments);
