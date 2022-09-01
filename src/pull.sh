#!/bin/bash

echo "cwd $CWD"
echo cloning...
git clone https://github.com/near/near-api-js.git ./near-api-js
cd near-api-js
echo "cwd $CWD"
echo installing...
yarn install
./docs/build.sh