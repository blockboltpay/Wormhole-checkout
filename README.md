# Cross Chain Payment Bridge - Wormhole Checkout

We utilize the Circle CCTP on top of the Wormhole SDK to implement cross-chain USDC transfer functionalities within the Blockbolt payment infrastructure.

Func 1: The user (payer) can make payments on the Wormhole-supported chain, and the merchant will receive it on the specified chain at the payment gateway.

Func 2: The merchant wishes to receive the order amount in USDC on the specific chain exclusively.

Func 3: Implement the SDK (Token Transfer) in Flutter DART for Android and iOS applications. We will make it open source.

# Installation guide

Packages are included in the package.json so just run following after setting the project into your local / testing enviroment.
### `npm install`

Once installed run the app on browser 
### `npm start`

————————————

If in case CORS or HTTP error in console just generate the sslOptions and set your pem key in server.js in root of the project.

const sslOptions = {
  key: fs.readFileSync('PATH_TO_PEM.pem'),
  cert: fs.readFileSync('PATH_TO_CERT.pem'),
};

node server.js in terminal
Once the server.js started, default port - 3000 

### `npm start`

It will start on new port e.g 3001 E.G https://localhost:3001

————————————

Routes directly set to WormholeTransfer component.

# Supported Source Chain
- Base Sepolia
- Arbitrum Sepolia

# Supported Destination Chain
- Base Sepolia
- Arbitrum Sepolia
- ETH Sepolia
- OP Sepolia
- AvalancheFuji

————————————

Check this code demo at 
https://wc.blockbolt.io/

Demo video:
https://youtu.be/aOfypdskGbY

————————————

# We have integrated this flow on BlockBolt Checkout. Please review at https://store.blockbolt.io/mocha

Powered by Wormhole & Circle.
