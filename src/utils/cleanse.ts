export const cleanse = (str: string, spaces: boolean = false) => {
  let s = str;
  if (spaces) {
    s = String(s).split(" ").join("");
  }
  return (
    s
      ? String(s)
          .split("/")
          .join("")
          .split("=")
          .join("")
          .split("*")
          .join("")
          .split("!")
          .join("")
          .split("-")
          .join("")
          .trim()
      : ""
  ).replace(/\s+/g, " ");
};
