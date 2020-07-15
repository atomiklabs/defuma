# Decentralised Full Market

...

## Getting Started
This project has been built following a monorepo approach, and it leverages a mix of `yarn workspaces` and `lerna`. You can learn more about the monorepo paradigm (and associated tooling) in [this article](https://doppelmutzi.github.io/monorepo-lerna-yarn-workspaces/).

The monorepo covers a group of packages required to build a decentralised application (dApp) for Web 3.0. Packages included:
- `@tomiklabs/agents` for smart contracts development,
- `@tomiklabs/web-ui` for client-side application allowing to use the dApp's features.


## Installing
To install all dependencies (also the ones required by `packages/*`) just run:
```
yarn install
```

## Deployment
### Actors (smart contracts)
TBD

## Testing
### Actors (smart contracts)
```
yarn lerna run test --scope=@tomiklabs/actors
```

## Built With
* [Buidler](https://buidler.dev): bootstraping smart contract development suite,
* [Create React App](https://create-react-app.dev/): bootstraping the Web UI development suite,
* [Textile Buckets](https://textileio.github.io/js-hub/docs/hub.buckets): maintaining encrypted data files.

## Authors

Tomik Labs:
* **Nick Zbiegien**
* **Tomasz Kopacki**

## License

