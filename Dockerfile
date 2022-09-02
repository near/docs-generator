FROM debian:latest

RUN apt update
RUN apt install -y gcc g++ make build-essential curl sudo git jq
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN sudo apt install -y nodejs
RUN npm install -g yarn

WORKDIR /app

COPY builder ./builder
RUN cd builder && yarn install

COPY entrypoint.sh ./
ENTRYPOINT ["/app/entrypoint.sh"]
