const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    const errors = err.errors || err.issues;
    if (errors) {
      return res.status(400).json({
        status: "fail",
        message: errors.map((e) => e.message).join(", "),
      });
    }
    return res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = validate;
