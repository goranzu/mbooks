function formatError(errors) {
  return errors.reduce((acc, err) => {
    if (!Array.isArray(acc[err.path])) {
      acc[err.path] = [];
    }

    acc[err.path].push(err.message);

    return acc;
  }, {});
}

export { formatError };
