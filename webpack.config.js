import path from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    alias: {
      "@": path.resolve(__dirname, "extension"),
    },
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
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NEXT_PUBLIC_API_URL": JSON.stringify(
        process.env.NEXT_PUBLIC_API_URL
      ),
    }),
  ],
};

export default config;
