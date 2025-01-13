# Settlus

**Settlus** is a purpose-built blockchain designed to provide a transparent settlement system for the creator economy.

## Get started
### Install necessary dependencies
```shell
# install ignite CLI
# Check https://github.com/ignite/cli/releases/tag/v0.27.2 to find appropriate asset version for your OS
curl -L -o ignite.tar.gz https://github.com/settlus/cli/releases/download/v0.27.2-settlus/ignite_0.27.2-settlus_darwin_amd64.tar.gz
tar -xzvf ignite.tar.gz
sudo mv ignite /usr/local/bin
rm -rf ignite.tar.gz

# install golangci-lint
brew install golangci-lint
```

### Run the chain
```shell
ignite chain serve --skip-proto
```

`serve` command installs dependencies, builds, initializes, and starts your blockchain in development.

## Development
### Build
```shell
make
```

### Lint
```shell
make lint
```

### Test
```shell
make test
```

### Generate protobuf definition
```shell
make proto-gen
```

### Generate Swagger
```shell
make proto-swagger-gen
```

### Local network test
```shell
make localnet-build
make localnet-start

# stop local network test
make localnet-stop
```

## License
This project is licensed under the [LGPL-3.0 license](LICENSE).
