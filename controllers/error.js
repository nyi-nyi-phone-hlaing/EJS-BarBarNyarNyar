exports.error404 = (req, res) => {
  res.status(404).render("error/404", {
    title: "Page Not Found",
    status_key: 404,
    status_msg: "Page Not Found",
  });
};

exports.error500 = (err, req, res, next) => {
  res.status(500).render("error/500", {
    title: "Internal Server Error",
    status_key: 500,
    status_msg: err.message,
  });
};
