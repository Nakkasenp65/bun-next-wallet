// eslint.config.mjs

import next from "eslint-config-next";

export default [
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"], // Adjust glob if you don't use a 'src' directory
    ...next,
    rules: {
      ...next.rules,
      "react-hooks/exhaustive-deps": "error",
      "@next/next/no-img-element": "off",
    },
  },
];
