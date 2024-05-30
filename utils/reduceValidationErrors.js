module.exports = (errors) => {
  return errors
    .reverse()
    .reduce((acc, curr) => ({ ...acc, [curr.path]: curr.message }), {});
};
