import { MongoClient } from 'mongodb'

const MONGO_URL = 'mongodb://localhost:27017/blog';

export const dbConnect = async () => {
  const db = await MongoClient.connect(MONGO_URL);
  const Posts = db.collection('posts');
  const Comments = db.collection('comments');
  return {
    Posts,
    Comments
  }
};