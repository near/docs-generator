#!/bin/sh

git clone https://github.com/maxhr/near-api-js ./sources/near-api-js
cd sources/near-api-js
git pull
yarn install
yarn build
cd ../../
