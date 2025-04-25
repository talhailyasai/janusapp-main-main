export function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

export function getToken() {
  if (localStorage.getItem("token")) {
    const token = JSON.parse(localStorage.getItem("token") || "");
    return token;
  }
  return "";
}
