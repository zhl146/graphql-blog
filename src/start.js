import {MongoClient, ObjectId} from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'

const URL = 'http://localhost';
const PORT = 3001;
const MONGO_URL = 'mongodb://localhost:27017/blog';

const prepare = (o) => {
  o._id = o._id.toString();
  return o
};

export const start = async () => {
  try {
    const db = await MongoClient.connect(MONGO_URL);

    const Posts = db.collection('posts');
    const Comments = db.collection('comments');

    const typeDefs = [`
      type Query {
        post(_id: String): Post
        posts(tag: String): [Post]
        comment(_id: String): Comment
      }

      type Post {
        _id: String
        creationDate: String
        editDate: String
        title: String!
        content: String!
        tags: [String]
        comments: [Comment]
      }

      type Comment {
        _id: String
        postId: String
        content: String!
        post: Post
      }

      type Mutation {
        createPost(title: String, content: String, tags: [String]): Post
        createComment(postId: String, content: String): Comment
      }

      schema {
        query: Query
        mutation: Mutation
      }
    `];

    const resolvers = {
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
            creationDate: Date.now(),
            editDate: 0
          });
          console.log(res);
          return prepare(await Posts.findOne({_id: res.insertedId}))
        },
        createComment: async (root, args) => {
          const res = await Comments.insertOne(args);
          return prepare(await Comments.findOne({_id: res.insertedId}))
        }
      },
    };

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    });

    const app = express();

    app.use(cors());

    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));

    app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql'
    }));

    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}`)
    })

  } catch (e) {
    console.log(e)
  }

};
