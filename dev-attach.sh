#!/bin/sh -l

docker build -t docs-generator . && docker run -it --entrypoint /bin/bash docs-generator