module.exports = {
    ci: {
      collect: {
        "staticDistDir": "./"
      },
      assert: {
        "preset": "lighthouse:no-pwa",
        "assertions": {
            "csp-xss": "off",
            "unused-javascript": ["warn", {"maxNumericValue": 1}]
        }
      },
      upload: {
        "target": "temporary-public-storage"
      }
    }
  };