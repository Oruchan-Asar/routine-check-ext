import path from "path";

const config = {
  mode: "production",
  entry: {
    popup: "./extension/popup/index.tsx",
    background: "./extension/background.ts",
  },
  output: {
    path: path.resolve(__dirname, "extension/dist"),
    filename: "[name]/index.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
};

export default config;
