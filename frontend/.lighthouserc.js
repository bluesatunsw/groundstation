module.exports = {
    ci: {
      collect: {
        "staticDistDir": "./"
      },
      assert: {
        "preset": "lighthouse:no-pwa",
        "assertions": {
            "csp-xss": "off",
            "geolocation-on-start": "off"
        }
      },
      upload: {
        "target": "temporary-public-storage"
      }
    }
  };