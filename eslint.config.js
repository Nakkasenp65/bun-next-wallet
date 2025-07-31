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
      "no-unused-vars": ["error", { args: "after-used", ignoreRestSiblings: true }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "import/no-unresolved": "error", // ปิดไปเพราะ Next.js จัดการเรื่อง path เองได้ดีอยู่แล้ว
      "import/order": [
        "error",
        {
          groups: ["type", "builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
