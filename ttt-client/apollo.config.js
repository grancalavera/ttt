module.exports = {
  client: {
    service: {
      name: "ttt",
      url: "http://localhost:4000/",
      headers: {
        authorization: "bXJmb29AbXJmb28uY29tX19AQEBfX21yZm9v",
        "x-foo-bar": "custom silly header"
      },
      skipSSLValidation: true
    }
  }
};
