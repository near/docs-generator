# Docs generator for `near-api-js`

This repo is a docs generator for [`near-api-js`](https://github.com/near/near-api-js).

It's using [Docusaurus](https://docusaurus.io/).

The actual docs content is in the source code (TypeDoc) and some MD files in the source-code repo.

## How it works

A GitHub Action [`near-api-js` repo](https://github.com/near/near-api-js) is triggered upon every release.

The source-code repo contains a build script that:
1. Clones this repo
2. Invokes a Docusaurus build from this repo

## Contributing to this repo

First `yarn install`.

A preparation script [`./dev-prepare.sh`](./dev-prepare.sh) will
clone and build the source code of `near-api-js`, so that you 
can work with an actual source code.

All package.json command are invoked with `dev.sh` to set
environment vars necessary for the config.

## Roadmap for this tool

1. We want to make it a generator for other libraries of ours.
2. We want it to push docs to our @near/docs repo to have a unified docs side
