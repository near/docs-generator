#!/bin/bash

echo cloning...
git clone https://github.com/near/near-api-js.git ./near-api-js
cd near-api-js
echo installing...
yarn install
cd docs
echo building...
./build.sh