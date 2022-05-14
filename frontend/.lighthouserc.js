module.exports = {
  "ci": {
    "collect": {
      "url": [
        "http://127.0.0.1:4000"
      ],
      "startServerCommand": "http-server ./build -p 4000 -g",
      "startServerReadyPattern": "Available on",
      "numberOfRuns": 1,
      "settings": {
        "chromeFlags": "--no-sandbox",
        "emulatedFormFactor": "desktop"
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    },
    "assert": {
      "preset": "lighthouse:recommended",
    }
  }
};