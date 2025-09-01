# ByteForge

The `ByteForge` is a playground for trying concepts and proving ideas.

## Requirements

- Node.js version 24.0.0 or higher
- pnpm (latest version recommended)

## Setup

Perform all steps bellow in the root of this repository.

### Install required NodeJs

Set the NodeJS version for your terminal. Command will automatically pick the NodeJs version required in the project `.nvmrc` file.

```sh
nvm use
```

If the NodeJs of the given version is not available on your computer, the nvm will ask you to install it. Just run:

```sh
nvm install
```

The `nvm` will automatically download and install the correct version of NodeJs for you based on the `.nvmrc` file in the root of this repository.

### Install pnpm

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

**Post-installation steps**

Set the `PNPM_HOME` environment variable in your bash rc file. 
(e.g., `~/.bashrc` or `~/.zshrc` located at your home directory).

```sh
export PNPM_HOME="/Users/[USERNAME]/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
```

Restart your terminal and check that `pnpm` is installed:

```
pnpm --version
```

### Install production and development dependencies

```sh
pnpm install
```