# Yarn

Javascript doesn't ship with its own package management system - and our
team prefers to use [`yarn`] for the job. You won't need to install `yarn`
on your host machine if you're using the blessed docker local development
workflow. [`yarn`] is installed upstream in the base image.

We do configure the tool further in our own `Dockerfile` to prevent common
mistakes and keep the local development experience as fast as possible.
If you're brand new to [`yarn`], please visit the link below to learn more!

[`yarn`]: https://yarnpkg.com/en/
