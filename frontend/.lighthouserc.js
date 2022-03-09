module.exports = {
    ci: {
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