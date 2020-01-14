# Conventions

The React and Redux ecosystems are evolving quickly! For Outcomes, we're
using a few guideposts to help keep ourselves sane and the project well
factored. Keep in mind that if you're stuck because of our "best practices"
- throw them away! They're opinions at best.

## Filenames

Filenames should always strive to be formatted using the same casing as
the module's own default export. For example, with a class or constructor
function the name `Wut.js` or `WutNow.js` would be used and for a utility
function or plain object `zomg.js` or `zomgFrd.js`.

## Source Tree

The important bits of our application are organized like so:

```
ui
└──src
   ├──components
   ├──containers
   ├──services
   └──store
      └──{domain}
```

### /src

The `src` directory captures the template entrypoint for the application
at `index.html` and the javascript entrypoint at `index.js`. We also have
a `constants.js` file to consolidate magic strings that would otherwise
be scattered throughout the application.

### /src/components

The `components` directory captures all of our plain react components
in a flat file structure. Plain react components receive data from their
parents through props and may hold simple local component state. They are
primarily concerned with rendering UI and are not redux aware.

### /src/containers

The `containers` directory captures all of our redux aware components
in a flat file structure. Redux aware components are coupled to reducers,
selectors, and action creators through `connect`. They are primarily
concerned with dispatching actions.

When accessing the store through `connect`, redux aware components should
always strive to use a selector. This encapsulates the internal structure
of our application state and hides it from the views.

### /src/services

The `services` directory captures abstraction facades for external APIs
like our own backend. Services should always strive to be stateless, with
any API or transport layer related state kept in our store.

### /src/store

The `store` directory captures all logic related to managing the redux
store, which includes reducers, selectors, and action creators. The
directory is namespaced further by application domain. For example:

`ui/src/store/admin/reducer.js`
_Admin reducer as a default export with all selectors as named exports_

`ui/src/store/admin/action.js`
_All the admin action creators as named exports, including thunks etc_
