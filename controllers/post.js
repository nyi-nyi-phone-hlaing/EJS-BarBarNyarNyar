const posts = [];

exports.renderHomePage = (req, res) => {
  res.render("homepage", { title: "Home Page", postsArr: posts });
};

exports.renderCreatePage = (req, res) => {
  res.render("create-post", { title: "Create Post" });
};

exports.createPost = (req, res) => {
  const { title, description, photo } = req.body;
  posts.push({
    id: Math.floor(Math.random() * 1e99),
    title,
    description,
    imgUrl: photo,
  });
  res.redirect("/");
};

exports.getPostDetails = (req, res) => {
  const postId = Number(req.params.postId);
  const post = posts.find((post) => post.id === postId);
  res.render("details", { title: post.title, post });
};
