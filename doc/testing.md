# Testing

Outcomes uses [Jest] and [React Testing Library] for our test suite. We have `__tests_jest_rtl__` directories
located at any level of the filesystem where tests can be created using the following convention:

logic: `src/components/lol.js`
tests: `src/components/__tests_jest_rtl__/lol.test.js`

To run the test suite:

```
yarn test:jest-rtl
```

[Jest]: https://jestjs.io/
[React Testing Library]: https://testing-library.com/docs/react-testing-library/intro/

## Development Setup

To set up the development environment with Docker:

```
docker-compose run --rm ui yarn --ignore-scripts
```

To run tests in Docker:

```
docker-compose run --rm ui yarn test:jest-rtl
```

Open `ui.outcomes.docker` in your browser for the development server.

## Linting

Run `yarn run lint` to lint the src dir, or use Docker:

```
docker-compose run --rm ui yarn run lint
```

We are using [ESLint](http://eslint.org/).

As a convenience, you can install a pre-push hook for git to prevent pushing eslint failing code to gerrit.

```sh
cp hooks/pre-push.example .git/hooks/pre-push
```

## Code Coverage

Code coverage is automatically generated when running the test suite with `yarn test:jest-rtl`.

After running tests, you can inspect the generated HTML report:

`open coverage/index.html`
