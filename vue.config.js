const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  lintOnSave: true,
  transpileDependencies: ["vuetify"],
  devServer: {
    allowedHosts: "all",
    proxy: "http://10.99.65.202:80/"
  }
});

// module.exports = {
//   lintOnSave: true,
//   publicPath: "/admin/",
//   runtimeCompiler: true,
//   transpileDependencies: ["vuetify"],
//   devServer: {
//     disableHostCheck: true,
//     proxy: "http://localhost/"
//   }
// };
