# wdio-eslinter-service

Have you ever run your e2e tests, only to find out 10, 15, or 30 minutes later that there was a missing/misspelled import, which didn't appear until the middle of the test run?  When this happens, the test runner reports these tests as broken.

eslint is a great tool for catching different errors pre-runtime, and this service runs the eslint tool, prior to executing WebdriverIO tests, as an automated step instead of a manual one.

It's oftentimes better to fail faster so we can fix problems sooner rather than later.

The recommended configuration is to use the unresolved runner to just check missing imports, but if desired, you can also configure the service to run the eslinter in your project using the npm or yarn runner, or by passing in a flag that tells the system to use your .eslintrc configuration as well.

## Installation

Install the wdio-eslinter-service:

```
$ npm i wdio-eslinter-service --save-dev 
```


### Quick Start - Check for missing or unresolved imports only

By default, this minimal configuration, the "unresolved" runner, checks for unresolved require imports and throws an error if unresolved imports are found. The service then stops execution. You can customize .eslintrc.js to perform more checks using the "npm" or "yarn" runners, if desired. See [eslint](https://www.npmjs.com/package/eslint) for more details.

If you don't have an `.eslintrc.js` configuration in your project, then wdio-eslinter-service can be configured to use a default one which just checks for missing imports before running the tests. This is handy so that you find out about incorrect imports sooner rather than later. To configure this, add the following eslinter configuration to your services array (assuming you already are using the chromedriver service; otherwise, leave that part out):

**wdio.conf.js:**
```
    services: ['chromedriver', [
        'eslinter',
        {
            runnerType: 'unresolved'
        }
    ]],
```

At this point, start running the tests, and if there is a missing or incorrect import, WebdriverIO will log it and immediately terminate the test run:

```
$ npx wdio
```


#### Optional - if using module-alias

If you're using the [module-alias](https://www.npmjs.com/package/module-alias) module, which lets you configure aliases to replace relative paths, you'll need to pass that into the eslinter configuration using the eslint-import-resolver-custom-alias plugin. Below is an example:

```
    services: ['chromedriver', [
        'eslinter',
        {
            runnerType: 'unresolved',
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

Install the plugin in your project:

```
$ npm i eslint-import-resolver-custom-alias
```

Run the tests and verify the system will find incorrect imports that use module aliases:

```
$ npx wdio
```

#### Experimental - Use along with an existing eslintrc configuration in your project

To also have the eslinter service use an existing eslintrc configuration in your project, set `includeProjectEslintrc` to true in the wdio.conf.js configuration services array.

I've experienced problems with conflicting plugins. If your project eslint setup is also looking for unresolved imports, then this may not work and may require adjustments to your .eslintrc.js. This is not recommended at this time.


### Advanced Alternatives - Using the npm and yarn runners

The npm and yarn runners help give you additional control over running an existing eslinter setup in your project. With this configuration, you can define extra commands to run in the run-scripts section in your package.json:

Inside your `package.json`, add this entry to your run scripts:

```json
{
    "scripts": {
        "eslint": "eslint ."
    }
}
```

**NOTE: Adding eslint to the package.json is required for the service to function when using the npm or yarn runners.**

If you don't already have eslint installed and configured, you'll need to install it and configure it in your project, as well as any plugins you're using, such as eslint-plugin-import:

```
$ npm i eslint eslint-plugin-import
```

If you're using eslint-import-resolver-custom-alias plugin to map module aliases to their real paths, then you'll need to install it as well:

```
$ npm i eslint-import-resolver-custom-alias
```

You'll also need to create an `.eslintrc.js` file, if you don't already have one of the eslintrc configuration files in your project. Here is a basic setup to just look for unresolved imports, and you can expand this configuration to validate other code quality checks before running tests:

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

