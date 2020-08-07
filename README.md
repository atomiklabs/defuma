# Decentralised Full Market

Data exchange allowing the providers to introduce their products and make them discoverable by the advertisers. The advertisers would drive the consumers attention on the products. A Three-Way Coasean Bargain to create a win-win-win case!

## Demo
* https://atomiklabs.herokuapp.com/

<img src="https://i.ibb.co/gdSgHqj/Screen-Shot-2020-08-07-at-03-50-31.png" width="50%">

## Monorepo
The monorepo covers a group of packages required to build a decentralised application (dApp) for Web 3.0. Packages included:
- `@atomiklabs/actors` for smart contracts development.
- `@atomiklabs/web-ui` for client-side application allowing to use the dApp's features.
- `@atomiklabs/web-ui/server` for authorization server (*merged here coz of web sockets issues on Heroku).
- `@atomiklabs/content-manager` textile buckets management.
- `@atomiklabs/heroku` for Heroku deployment.


## Run Scripts
actors
```json
    "chain": "yarn buidler node",
    "test": "yarn buidler test --network buidlerevm",
    "compile": "yarn buidler compile",
    "deploy": "yarn buidler run scripts/deploy.js --network rinkeby && yarn buidler run scripts/publish.js",
    "watch": "node scripts/watch.js",
    "accounts": "yarn buidler accounts",
    "balance": "yarn buidler balance",
    "send": "yarn buidler send"
```
web-ui
```json
    "start": "react-scripts start",
    "build": "GENERATE_SOURCEMAP=false react-scripts build",
    "test": "react-scripts test",
    "server": "node build-server/server.app.js",
    "server:build": "tsc -p server"
```
content-manager
```json
    "start": "tsdx watch",
    "build": "tsdx build",
    "test": "tsdx test --passWithNoTests",
    "lint": "tsdx lint",
    "prepare": "tsdx build"
```
heroku
```json
    "deploy": "python deploy.py",
    "start": "ENV='production' node web-ui/build-server/server.app.js"
```

## Built With
* [Buidler](https://buidler.dev): bootstraping smart contract development suite,
* [Create React App](https://create-react-app.dev/): bootstraping the Web UI development suite,
* [Textile Buckets](https://textileio.github.io/js-hub/docs/hub.buckets): maintaining encrypted data files.
* Heroku
* WebSockets
* Libp2p
* Tsdx
* Typescript
* Node
* Koa

## Project Tree
```
.
├── packages
│   ├── actors
│   │   ├── contracts
│   │   │   └── Defuma.sol
│   │   ├── ipfs
│   │   │   ├── bucky
│   │   │   │   ├── products
│   │   │   │   │   ├── guitar.json
│   │   │   │   │   └── piano.json
│   │   │   │   └── meta.json
│   │   │   └── bucky2
│   │   │       ├── products
│   │   │       │   ├── guitar.json
│   │   │       │   └── piano.json
│   │   │       └── meta.json
│   │   ├── scripts
│   │   │   ├── deploy.js
│   │   │   ├── publish.js
│   │   │   └── watch.js
│   │   ├── test
│   │   │   └── Defumta.test.js
│   │   ├── .env
│   │   ├── .gitattributes
│   │   ├── .gitignore
│   │   ├── buidler.config.js
│   │   └── package.json
│   ├── content-manager
│   │   ├── example
│   │   │   ├── .gitignore
│   │   │   ├── index.html
│   │   │   ├── index.tsx
│   │   │   ├── package.json
│   │   │   ├── tsconfig.json
│   │   │   └── yarn.lock
│   │   ├── src
│   │   │   ├── buckets.ts
│   │   │   ├── hooks.ts
│   │   │   └── index.tsx
│   │   ├── .gitignore
│   │   ├── LICENSE
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   ├── heroku
│   │   ├── .gitignore
│   │   ├── deploy.py
│   │   └── package.json
│   └── web-ui
│       ├── public
│       │   └── index.html
│       ├── server
│       │   ├── hub-helpers.ts
│       │   ├── server.app.ts
│       │   ├── tsconfig.json
│       │   └── wss.ts
│       ├── src
│       │   ├── contracts
│       │   │   ├── contracts.js
│       │   │   ├── Defuma.abi.js
│       │   │   ├── Defuma.address.js
│       │   │   └── Defuma.bytecode.js
│       │   ├── login
│       │   │   ├── authClient.ts
│       │   │   ├── index.ts
│       │   │   └── login.tsx
│       │   ├── provider
│       │   │   ├── balance.tsx
│       │   │   ├── defuma.tsx
│       │   │   ├── index.ts
│       │   │   └── provider.tsx
│       │   ├── config.ts
│       │   ├── index.tsx
│       │   ├── main.css
│       │   ├── main.tsx
│       │   └── react-app-env.d.ts
│       ├── .env
│       ├── .eslintrc.js
│       ├── .gitignore
│       ├── package.json
│       ├── README.md
│       └── tsconfig.json
├── .gitignore
├── .prettierrc
├── .solhint.json
├── package.json
├── README.md
└── yarn.lock
```

## Authors
[Atomik Labs](http://atomiklabs.io/)
* **Nick Zbiegien**
* **Tomasz Kopacki**

## License

