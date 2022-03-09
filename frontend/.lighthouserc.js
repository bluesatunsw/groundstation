module.exports = {
    ci: {
      collect: {
        "staticDistDir": "templates"
      },
      assert: {
        "preset": "lighthouse:no-pwa",
        "assertions": {
            "csp-xss": "off"
        }
      },
      upload: {
        "target": "temporary-public-storage"
      }
    }
  };