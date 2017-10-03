import { ObjectId } from "mongodb";
import moment from "moment";

import { momentFormat } from "../util/moment.config";

const prepare = o => {
  o._id = o._id.toString();
  return o;
};

// QUERIES

export const getPostById = async (root, { _id }, { Posts }) =>
  prepare(await Posts.findOne(ObjectId(_id)));

export const makePostQuery = (
  tag = null,
  year = null,
  month = null,
  day = null
) => {
  let query = {};
  if (tag) query.tags = tag;
  if (year) query.creationYear = year;
  if (month) query.creationMonth = month;
  if (day) query.creationDay = day;
  return query;
};

export const getPosts = async (
  root,
  { tag = null, year = null, month = null, day = null, limit = 10, offset = 0 },
  { Posts }
) =>
  (await Posts.find(makePostQuery(tag, year, month, day))
    .sort({ creationDate: -1 })
    .skip(offset)
    .limit(limit)
    .toArray()).map(prepare);

export const getCommentById = async (root, { _id }, { Comments }) =>
  prepare(await Comments.findOne(ObjectId(_id)));

export const getTags = async (root, args, { Tags }) =>
  (await Tags.find({}).toArray()).map(prepare);

export const getCommentsByPostId = async ({ _id }, args, { Comments }) =>
  (await Comments.find({ postId: _id }).toArray()).map(prepare);

export const getTagsByPost = async ({ tags }, args, { Tags }) =>
  await Promise.all(
    tags.map(async tagId => prepare(await Tags.findOne(ObjectId(tagId))))
  );

export const getPostByComment = async ({ postId }, args, { Posts }) =>
  prepare(await Posts.findOne(ObjectId(postId)));

// MUTATIONS

export const createPost = async (
  root,
  { title, preview, content, tags = [] },
  { Posts }
) => {
  const today = new Date();
  const res = await Posts.insertOne({
    title,
    content,
    preview,
    tags,
    creationDate: today,
    creationYear: today.getFullYear(),
    creationMonth: today.getMonth(),
    creationDay: today.getDate(),
    editDate: null
  });
  return prepare(await Posts.findOne({ _id: res.insertedId }));
};

export const createComment = async (root, args, { Comments }) => {
  const res = await Comments.insertOne(args);
  return prepare(await Comments.findOne({ _id: res.insertedId }));
};

export const createTag = async (root, { content }, { Tags }) => {
  const res = await Tags.insertOne({ content });
  return prepare(await Tags.findOne({ _id: res.insertedId }));
};

export const makePostUpdate = (title, preview, content, tags) => {
  let update = { editDate: moment().format(momentFormat) };
  if (title) update.title = title;
  if (preview) update.preview = preview;
  if (content) update.content = content;
  if (tags) update.tags = tags;
  return update;
};

export const editPost = async (
  root,
  { _id, title, preview, content, tags = [] },
  { Posts }
) => {
  const res = await Posts.findOneAndUpdate(ObjectId(_id), {
    $set: makePostUpdate(title, preview, content, tags)
  });
  return prepare(await Posts.findOne(ObjectId(_id)));
};

export const deleteById = async (_id, collection) => {
  const res = await collection.findOne({ _id: ObjectId(_id) });
  await collection.deleteOne({ _id: ObjectId(_id) });
  return res;
}

export const deletePost = async (root, { _id }, { Posts }) => {
  return await deleteById(_id, Posts);
};

export const deleteTag = async (root, {_id}, { Tags }) => {
  return await deleteById(_id, Tags);
}

export const deleteComment = async (root, {_id}, { Comments }) => {
  return await deleteById(_id, Comments);
}

export const blogResolvers = {
  Query: {
    post: getPostById,
    posts: getPosts,
    comment: getCommentById,
    tags: getTags
  },
  Post: {
    comments: getCommentsByPostId,
    tags: getTagsByPost
  },
  Comment: {
    post: getPostByComment
  },
  Mutation: {
    createPost,
    createComment,
    createTag,
    editPost,
    deletePost,
    deleteTag,
    deleteComment
  }
};
