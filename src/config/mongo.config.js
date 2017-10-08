import { MongoClient } from "mongodb";

const MONGO_URL = "mongodb://localhost:27017/blog";

const dbConnect = async () => {
  const db = await MongoClient.connect(MONGO_URL);
  const Posts = db.collection("posts");
  const Comments = db.collection("comments");
  const Tags = db.collection("tags");
  // Tags.remove()
  // Posts.remove()
  // Comments.remove()
  return {
    Tags,
    Posts,
    Comments
  };
};

export default dbConnect;
