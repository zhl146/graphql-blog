export const blogTypeDefs = [
  `
      type Query {
        post(_id: String): Post
        posts(tag: String, offset: Int, limit: Int, year: Int, month: Int, day: Int): [Post]
        comment(_id: String): Comment
        tags: [Tag]
      }

      type Post {
        _id: String
        author: Author
        creationDate: String
        creationYear: Int
        creationMonth: Int
        creationDay: Int
        editDate: String
        title: String!
        preview: String!
        content: String!
        tags: [Tag]
        comments: [Comment]
      }
      
      type Author {
        _id: String
        firstName: String!
        lastName: String!
        email: String
        description: String
      }
      
      type Tag {
        _id: String
        content: String
      }

      type Comment {
        _id: String
        postId: String
        content: String!
        post: Post
      }

      type Mutation {
        createPost(title: String!, preview: String!, content: String!, tags: [String]): Post
        createComment(postId: String, content: String): Comment
        createTag(content: String!): Tag
        editPost(_id: String!, title: String, preview: String, content: String, tags: [String]): Post
        editTag(_id: String!, content: String!): Tag
        editComment(_id: String!, content: String!): Comment
        deletePost(_id: String!): Post
        deleteTag(_id: String!): Tag
        deleteComment(_id: String!): Comment
      }

      schema {
        query: Query
        mutation: Mutation
      }
    `
];
