module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  devServer: {
    disableHostCheck: true,
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");

    svgRule.uses.clear();

    svgRule
      .use("babel-loader")
      .loader("babel-loader")
      .end()
  },
};
