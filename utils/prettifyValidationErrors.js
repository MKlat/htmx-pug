module.exports = (errors) => {
  const output = {};

  errors.reverse().forEach((error) => {
    output[error.path] = error.message;
  });

  return output;
};
