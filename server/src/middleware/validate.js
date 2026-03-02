const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.body = parsed.body;
    req.query = parsed.query;
    req.params = parsed.params;
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
