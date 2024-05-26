module.exports = (stepType, childIndex, childCount) => {
  let prev = "";
  let next = "child";
  const base = "/registration/";

  switch (stepType) {
    case "child":
      prev = childIndex === 1 ? "parent" : "child/" + --childIndex;
      next = childIndex === childCount ? "summary" : "child/" + ++childIndex;
    case "summary":
      prev = "child/" + childCount;
      next = "success";
  }

  return { prev: base + prev, next: base + next };
};
