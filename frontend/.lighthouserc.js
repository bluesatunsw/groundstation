module.exports = {
    ci: {
      collect: {
        "staticDistDir": "templates"
      },
      assert: {
        "preset": "lighthouse:no-pwa"
      },
      upload: {
        "target": "temporary-public-storage"
      }
    }
  };