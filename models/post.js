const mongodb = require("mongodb");

const { getDatabase } = require("../utils/database");

class Post {
  constructor(title, description, image_url) {
    this.title = title;
    this.description = description;
    this.image_url = image_url;
  }
  create() {
    const db = getDatabase();
    return db
      .collection("posts")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static getAllPost() {
    const db = getDatabase();
    return db
      .collection("posts")
      .find()
      .toArray()
      .then((posts) => {
        return posts;
      })
      .catch((err) => console.log(err));
  }

  static getPostById(id) {
    const db = getDatabase();
    return db
      .collection("posts")
      .find({ _id: new mongodb.ObjectId(id) })
      .next()
      .then((post) => {
        return post;
      })
      .catch((err) => console.log(err));
  }

  static deletePostById(id) {
    const db = getDatabase();
    return db
      .collection("posts")
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  updatePost(id) {
    const db = getDatabase();
    return db
      .collection("posts")
      .updateOne({ _id: new mongodb.ObjectId(id) }, { $set: this })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }
}

module.exports = Post;
