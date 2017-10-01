export const blogTypeDefs = [`
      type Query {
        post(_id: String): Post
        posts(tag: String, offset: Int, limit: Int): [Post]
        comment(_id: String): Comment
        tags: [Tag]
      }

      type Post {
        _id: String
        author: Author
        creationDate: String
        editDate: String
        title: String!
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
        createPost(title: String!, content: String!, tags: [String]): Post
        createComment(postId: String, content: String): Comment
        editPost(_id: String!, title: String, content: String, tags: [String]): Post
        createTag(content: String!): Tag
      }

      schema {
        query: Query
        mutation: Mutation
      }
    `];