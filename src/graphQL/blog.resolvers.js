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

export const makePostQuery = (tag = null, startDate = null, endDate = null) => {
  const tagQuery = tag ? { tags: tag } : {};
  const dateQuery =
    startDate && endDate
      ? { creationDate: { $gt: startDate, $lt: endDate } }
      : startDate && !endDate ? { creationDate: startDate } : {};
  return { ...tagQuery, ...dateQuery };
};

export const getPosts = async (
  root,
  { tag = null, startDate = null, endDate = null, limit = 10, offset = 0 },
  { Posts }
) =>
  (await Posts.find(makePostQuery(tag, startDate, endDate))
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
  { title, content, tags = [] },
  { Posts }
) => {
  const res = await Posts.insertOne({
    title,
    content,
    tags,
    creationDate: new Date(),
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
    createTag
  }
};
