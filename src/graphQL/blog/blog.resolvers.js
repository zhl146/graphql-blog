import moment from 'moment';

import { momentFormat } from "../../util/moment.config";

const prepare = (o) => {
  o._id = o._id.toString();
  return o
};

export const blogResolvers = {
  Query: {
    post: async (root, {_id}, {Posts}) => {
      return prepare(await Posts.findOne(ObjectId(_id)))
    },
    posts: async (root,
                  {
                    tag = null,
                    limit = 10,
                    offset = 0
                  },
                  {Posts}) => {
      return (await
        Posts.find(tag === null ? {} : {tags: tag})
          .skip(offset)
          .limit(limit)
          .toArray())
        .map(prepare)
    },
    comment: async (root, {_id}, {Comments}) => {
      return prepare(await Comments.findOne(ObjectId(_id)))
    },
  },
  Post: {
    comments: async ({_id}, {Comments}) => {
      return (await Comments.find({postId: _id}).toArray()).map(prepare)
    }
  },
  Comment: {
    post: async ({postId}, {Posts}) => {
      return prepare(await Posts.findOne(ObjectId(postId)))
    }
  },
  Mutation: {
    createPost: async (root, {title, content, tags=[]}, {Posts}) => {
      const res = await Posts.insertOne({
        title,
        content,
        tags,
        creationDate: moment().format(momentFormat),
        editDate: null
      });
      console.log(res);
      return prepare(await Posts.findOne({_id: res.insertedId}))
    },
    createComment: async (root, args, {Comments}) => {
      const res = await Comments.insertOne(args);
      return prepare(await Comments.findOne({_id: res.insertedId}))
    }
  },
};
