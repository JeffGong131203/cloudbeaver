# Steps to run
## Install Dependencies

```sh
yarn
yarn lerna bootstrap
```

## Build

```sh
yarn lerna run build --stream --scope=@cloudbeaver/product-default
```
open ```packages/product-default/lib/index.html``` or run ```npx serve packages/product-default/lib```

## Dev

```sh
yarn lerna run dev --stream --scope=@cloudbeaver/product-default
```

## Build GQL SDK
```sh
yarn lerna run gql:gen --stream
```

