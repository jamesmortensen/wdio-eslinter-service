# wdio-eslinter-service

Have you ever run your e2e tests, only to find out 10, 15, or 30 minutes later that there was a missing/misspelled import, which didn't appear until the middle of the test run?  When this happens, the test runner reports these tests as broken.

eslint is a great tool for catching different errors pre-runtime, and this service runs the eslint tool, prior to executing WebdriverIO tests, as an automated step instead of a manual one.

It's oftentimes better to fail faster so we can fix problems sooner rather than later.

If desired, you can also configure the service to run the eslinter in your project.

## Installation

Install the wdio-eslinter-service:

```
$ npm i wdio-eslinter-service --save-dev 
```

If you don't already have eslint installed and configured, you'll need to install it and configure it in your project:

```
$ npm i eslint eslint-plugin-import
```

### Check for missing or unresolved imports only

If you don't have an `.eslintrc.js` configuration in your project, then wdio-eslinter-service can be configured to use a default one which just checks for missing imports before running the tests. This is handy so that you find out about incorrect imports sooner rather than later. To configure this, add the following eslinter configuration to your services array:

```
    services: ['chromedriver', [
        'eslinter',
        {
            runnerType: 'unresolved',
            includeProjectEslintrc: false
        }
    ]],
```

If you're using the [module-alias]() module, which lets you configure aliases to replace relative paths, you'll need to pass that into the eslinter configuration, if you don't already have an `eslintrc` config file in your project. Below is an example:

```
    services: ['chromedriver', [
        'eslinter',
        {
            runnerType: 'unresolved',
            includeProjectEslintrc: false,
            eslintOverride: {
                "settings": {
                    "import/resolver": {
                        "eslint-import-resolver-custom-alias": {
                            "alias": {
                                "@utils": "./utils",
                                "@specs": "./test-sync/specs",
                                "@pageobjects": "./test-sync/pageobjects",
                                "@": "./"
                            }
                        }
                    }
                }
            }
        }
    ]],
```

Start running your tests to see it in action. You may need to intentionally break one of your require/imports to see what it looks like when it catches an error.

```
$ npx wdio
```

NOTE: To also have the eslinter service use an existing eslintrc configuration in your project, set `includeProjectEslintrc` to true in the wdio.conf.js configuration services array.
 

### If you already use eslint and have an existing eslintrc

If it's not already there, put `.eslintrc.js` in the root of your Node.js project:

```
// .eslintrc.js
module.exports = {
    "parserOptions": {
        "ecmaVersion": 2022
    },
    "plugins": [
        "import"
    ],
    "rules": {
        "import/no-unresolved": [
            2,
            {
                "commonjs": true,
                "amd": false,
                "caseSensitive": true
            }
        ]
    }
}
```

By default, this minimal configuration checks for unresolved require imports and throws an error if unresolved imports are found. The service then stops execution. You can customize .eslintrc.js to perform more checks, if desired. See [eslint](https://www.npmjs.com/package/eslint) for more details.

Inside your `package.json`, add this entry to your run scripts:

```json
{
    "scripts": {
        "eslint": "eslint ."
    }
}
```

**NOTE: Adding eslint to the package.json is required for the service to function when using the npm or yarn runners.**


Lastly, add the `eslinter` service to the services array in `wdio.conf.js`:

```javascript
    services: ['eslinter']
```

Run `npm run eslint` to verify and check for errors.

If you use `yarn` you can configure the `runnerType` service option:

```javascript
    services: [
        ['eslinter', { runnerType: 'yarn' }]
    ]
```

If you already have a linter script that you would like to reuse (instead of `eslint`), you can configure the `scriptName` service option:

```javascript
    services: [
        ['eslinter', { scriptName: 'eslint:check' }]
    ]
```

## Using in WebdriverIO

Start WebdriverIO's test runner as normal. eslint will check the code. If errors are found, execution immediately ceases.

```bash
$ npx wdio
```


**Example:**

```bash
$ npx wdio --spec ./test/specs/example.e2e.js 

Execution of 1 spec files started at 2021-05-15T12:04:05.388Z

2021-05-15T12:04:05.793Z WARN wdio-eslinter-service: initialize wdio-eslint-service using npm runner.
Deleted files and directories:
 /Users/jem/Dev/wdio-example/allure-results

/Users/jem/Dev/wdio-example/test/specs/login.js
  1:22  error  Unable to resolve path to module '.../pageObjects/Auth.page'  import/no-unresolved

✖ 1 problem (1 error, 0 warnings)

2021-05-15T12:04:08.581Z ERROR wdio-eslinter-service: SEVERE: Code contains eslint errors or eslint not installed.
```

