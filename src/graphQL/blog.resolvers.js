import {
  createPost,
  editPost,
  deletePost,
  getPostByComment,
  getPostById,
  getPosts
} from "../business-logic/db-access/db.posts-access";
import {
  createComment,
  editComment,
  deleteComment,
  getCommentById,
  getCommentsByPostId
} from "../business-logic/db-access/db.comments-access";
import {
  createTag,
  editTag,
  deleteTag,
  getTags,
  getTagsByPost
} from "../business-logic/db-access/db.tags-access";

const blogResolvers = {
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
    editTag,
    editComment,
    deletePost,
    deleteTag,
    deleteComment
  }
};

export default blogResolvers;
