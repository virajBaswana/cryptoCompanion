const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const runApp = async () => {
  await Moralis.start({
    apiKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImUzNThkOGI3LTc5NWEtNGY2NC1hMTg5LTNiZDQ0N2YyYzA4MiIsIm9yZ0lkIjoiNDEyMTEyIiwidXNlcklkIjoiNDIzNTA4IiwidHlwZUlkIjoiNjgxZjdhZWEtNTRlNy00NjQzLWE2YzgtZTcwODkzZGRiZWEzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjkxNDU2ODQsImV4cCI6NDg4NDkwNTY4NH0.e-LaSDCUkeHUz5JLtw8s8uL68A5NJnwCKQpCgeLTBT0",
    // ...and any other configuration
  });

  const address = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
//   const address = "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0";
//   const address = "0x455e53cbb86018ac2b8092fdcd39d8444affc3f6";

  const chain = EvmChain.ETHEREUM;

//   const api = `https://deep-index.moralis.io/api/v2.0/nativePrice?chain=eth`;

//   const res = await fetch(api, {
//     headers: {
//       "x-api-key":
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImUzNThkOGI3LTc5NWEtNGY2NC1hMTg5LTNiZDQ0N2YyYzA4MiIsIm9yZ0lkIjoiNDEyMTEyIiwidXNlcklkIjoiNDIzNTA4IiwidHlwZUlkIjoiNjgxZjdhZWEtNTRlNy00NjQzLWE2YzgtZTcwODkzZGRiZWEzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjkxNDU2ODQsImV4cCI6NDg4NDkwNTY4NH0.e-LaSDCUkeHUz5JLtw8s8uL68A5NJnwCKQpCgeLTBT0",
//     },
//   });

    const response = await Moralis.EvmApi.token.getTokenPrice({
      address,
      chain,
    });

//   const response = await res;
//   console.log(response);
    console.log(response.toJSON());
};

runApp();
