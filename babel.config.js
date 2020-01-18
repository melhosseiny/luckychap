const presets = [
  [
    "@babel/env",
    {
      //debug: true,
      useBuiltIns: "usage",
    },
  ],
];

const plugins = [
  "@babel/plugin-syntax-dynamic-import"
];

module.exports = { presets, plugins };
