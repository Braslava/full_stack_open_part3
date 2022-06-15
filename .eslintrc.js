module.exports = {
    "env": {
        "browser": true,
        node: true,
        "es2021": true
        },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "script"
    },
    "plugins": [
        "react"
    ],
    "rules": {
    }
}