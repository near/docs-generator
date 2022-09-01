#!/bin/bash

git clone https://github.com/maxhr/near--docs-generator.git ./generator
cd generator
node build-ncc/index.js