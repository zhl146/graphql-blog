import moment from 'moment';

import { momentFormat } from "../../util/moment.config";

const prepare = (o) => {
  o._id = o._id.toString();
  return o
};

export const makeBlogResolvers = ({Posts, Comments}) => ({
  Query: {
    post: async (root, {_id}) => {
      return prepare(await Posts.findOne(ObjectId(_id)))
    },
    posts: async (root, {tag = null}) => {
      return tag === null
        ? (await Posts.find({}).toArray()).map(prepare)
        : (await Posts.find({tags: tag}).toArray()).map(prepare)
    },
    comment: async (root, {_id}) => {
      return prepare(await Comments.findOne(ObjectId(_id)))
    },
  },
  Post: {
    comments: async ({_id}) => {
      return (await Comments.find({postId: _id}).toArray()).map(prepare)
    }
  },
  Comment: {
    post: async ({postId}) => {
      return prepare(await Posts.findOne(ObjectId(postId)))
    }
  },
  Mutation: {
    createPost: async (root, {title, content, tags=[]}) => {
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
    createComment: async (root, args) => {
      const res = await Comments.insertOne(args);
      return prepare(await Comments.findOne({_id: res.insertedId}))
    }
  },
});