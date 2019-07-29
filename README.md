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
- `GET /status`: returns tendermint and faucet urls
- `GET /tokens`: returns list of tokens

### Username
- `GET /username/:id`: returns user data based on username
- `POST /username`: creates a username
- `PATCH /username`: updates targets from specific username

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
- username to create: `bns-p_test-un_x5r0dm4838*iov`
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
    "targets": [
      {
        "chainId": "local-bns-devnet",
        "address": "tiov1te5s9q7up7kna962xznn7sgsnp5lhhstd3mgq7"
      }
    ],
    "username": "bns-p_test-un_x5r0dm4838*iov",
    "fee": {
      "tokens": {
        "quantity": "1000053000",
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

### Send transaction example
Based on:
- 12 words secret account: `devote figure chef merge throw swear muscle another midnight shock raven duck prefer wolf chase flight notice scout wrap hair pencil desk senior until`
- recipient address: `tiov16mmje4vu9e580krwghg9rcpcqnek3f5fp93ffp`
- chain id: `local-bns-devnet`
- nonce: 0

The following json object should be generated and post to transaction to transfer tokens:
```json
{
  "transaction": {
    "kind": "bcp/send",
    "creator": {
      "chainId": "local-bns-devnet",
      "pubkey": {
        "algo": "ed25519",
        "data": "a16779974533eec816585e9479f0f8e29adeca3b7edd4d1fbf5e750c079ca844"
      }
    },
    "sender": "tiov1q3w5edgppc2tcd60gqkxh6gsupszgez46duwd7",
    "recipient": "tiov16mmje4vu9e580krwghg9rcpcqnek3f5fp93ffp",
    "memo": "My first payment from IOV BNS-Proxy",
    "amount": {
      "quantity": "1000053000",
      "fractionalDigits": 9,
      "tokenTicker": "CASH"
    },
    "fee": {
      "tokens": {
        "quantity": "10000000",
        "fractionalDigits": 9,
        "tokenTicker": "CASH"
      }
    }
  },
  "primarySignature": {
    "pubkey": {
      "algo": "ed25519",
      "data": "a16779974533eec816585e9479f0f8e29adeca3b7edd4d1fbf5e750c079ca844"
    },
    "nonce": 0,
    "signature": "3e8bb061f46e02e82c5a3aa736b4f1f4b6303f24db07c8d79ebd7c2fcc78818db11254e7eb0a7476cc008a1ca05e648c23712c3d9bc5e49aa51572d1ee419204"
  },
  "otherSignatures": []
}
```