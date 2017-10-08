import { ObjectId } from "mongodb";
import moment from "moment";
import { momentFormat } from "../../util/moment.config";

import { editById, deleteById, prepare } from "./shared-functions";

export const getPostById = async (root, { _id }, { Posts }) =>
  prepare(await Posts.findOne(ObjectId(_id)));

export const makePostQuery = (
  tag = null,
  year = null,
  month = null,
  day = null
) => {
  const query = {};
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

export const getPostByComment = async ({ postId }, args, { Posts }) =>
  prepare(await Posts.findOne(ObjectId(postId)));

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

export const makePostUpdate = (title, preview, content, tags) => {
  const update = { editDate: moment().format(momentFormat) };
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
) => editById(_id, Posts, makePostUpdate(title, preview, content, tags));

export const deletePost = async (root, { _id }, { Posts }) =>
  deleteById(_id, Posts);
