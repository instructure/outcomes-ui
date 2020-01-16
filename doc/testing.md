# Testing

Outcomes uses [mocha], [chai], and [karma] for our test suite. Where applicable,
we have `__tests__` directories located at any level of the filesystem
where tests can be created using the following convention:

logic: `src/components/lol.js`
tests: `src/components/__tests__/lol.test.js`

To get setup for testing, make sure you have the `karma` service listed
in your `docker-compose.override.yml` and the `karma` image built. Then
run the following command to build and start the karma server:

```
docker-compose run --rm karma yarn --ignore-scripts
docker-compose run --rm karma yarn test
```

Open `karma.outcomes.docker` in your browser and save a source or test file
to trigger a test (re)run.

[mocha]: https://mochajs.org/
[chai]: http://chaijs.com/
[karma]: https://karma-runner.github.io

## Linting

Run `docker-compose run --rm karma yarn run lint` to lint the src dir.

We are using [ESLint](http://eslint.org/).

As a convenience, you can install a pre-push hook for git to prevent pushing eslint failing code to gerrit.

```sh
cp hooks/pre-push.example .git/hooks/pre-push
```

You might need to globally install a few eslint packages, depending on your environment.  Here's a start:

```sh
npm install -g eslint babel-eslint eslint-plugin-{format-message,react,mocha,standard,promise} eslint-config-standard{,-react}
```

## Code Coverage

To run a code coverage report add the following script argument:

`docker-compose run --rm karma yarn test -- --coverage`

After running tests as described above, you'll see a brief text overview
in your logs and can also inspect a generated HTML report like so:

`open coverage/ui/index.html`
