# BNS-Proxy

The usage of this BNS-proxy is very simple, to install it, run:

```
yarn install
yarn testnet-start (or local-start if bnsd and faucet available locally)
```

## Test
Run the following command to execute a test:
```
yarn testnet-test (or local-start if bnsd and faucet available locally)
```

## API
### General
- `GET /`: returns welcome message
- `GET /chain`: returns chain id

### Username
- `GET /username/:id`: returns user data based on username
- `POST /username`: creates a username

### Account
- `GET /account/address/:owner`: returns account information (addresses) based on iov address
- `GET /account/address/balance/:address`: returns account information (balances) based on iov address
- `GET /account/address/nonce/:owner` returns nonce based on iov address
- `GET /account/pubkey/nonce/:owner` returns nonce based on iov public key

### Transaction
- `POST /transaction`: creates a transaction

## Api Examples
### New username example
Based on:
- 12 words secret account: `dinosaur punch surface title crack sudden motion sight airport purse shoot napkin produce design wire mouse cake color tourist cricket purity brass speak once`
- username to create: `bns-p_test-un_x5r0dm4838`
- chaain id: `local-bns-devnet`
- nonce: 0

The following json object should be generated and send it to post username to create a new username:
```json
{
  "transaction": {
    "kind": "bns/register_username",
    "creator": {
      "chainId": "local-bns-devnet",
      "pubkey": {
        "algo": "ed25519",
        "data": "8c798d3b64dfb99aef02abecf278f3d45d6cf8ca4b235326724f22da711a22a4"
      }
    },
    "addresses": [
      {
        "chainId": "local-bns-devnet",
        "address": "tiov1te5s9q7up7kna962xznn7sgsnp5lhhstd3mgq7"
      }
    ],
    "username": "bns-p_test-un_x5r0dm4838",
    "fee": {
      "tokens": {
        "quantity": "5000000000",
        "fractionalDigits": 9,
        "tokenTicker": "CASH"
      }
    }
  },
  "primarySignature": {
    "pubkey": {
      "algo": "ed25519",
      "data": "8c798d3b64dfb99aef02abecf278f3d45d6cf8ca4b235326724f22da711a22a4"
    },
    "nonce": 0,
    "signature": "32daee76f163ad24c38458b0d9ab921eadaf9fec0e7e05e37de3659251c22c3b0aabf09e17a54151d6bfe1bf12efff7dd210b50852a873757c19a468f006670c"
  },
  "otherSignatures": []
}
```