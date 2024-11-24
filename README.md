# Node.js Test Runner Demo

## CLI Commands

-   **`node --test [files]`:** Runs the test files specified. If no files are specified, it runs all tests in the current directory.

    -   Example: `node --test test/my-test.js`

-   **`node --test --test-name-pattern "<pattern>"`:** Runs only tests with names matching the provided pattern.

    -   Example: `node --test --test-name-pattern "should sum numbers correctly"` or `node --test --test-name-pattern @tag`

-   **`node --test --watch`:** Runs tests in watch mode, automatically re-running them when files change.

-   **`node --test --help`:** Displays help information about the test runner and its options.

-   **`node --test --experimental-test-coverage`:** Generates a code coverage report.

-   **`node --test --test-reporter <reporter>`:** Specifies the output format for the test report (e.g., `tap`, `spec`, `dot`, `junit`).

-   **`node --test --test-reporter-destination <file>`:** Saves the test report to the specified file.
