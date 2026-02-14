import next from "eslint-config-next";

const config = [
  { ignores: ["exports/**"] },
  ...(Array.isArray(next) ? next : [next]),
];

export default config;
