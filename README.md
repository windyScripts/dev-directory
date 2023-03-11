# Dev Directory

This is a service for a community of devs to network, built by [100Devs](https://leonnoel.com/100devs/) for 100Devs.
Discussion can be found on the [Discord Thread](https://discord.com/channels/735923219315425401/1080598293538672700).

# Developing

## Git Conventions

Message Tim on Discord if you want to be added as a collaborator.

Branch names should be `#issuenumber-shortname` e.g. `#2-discord-auth` or `#4-profile-schema`.  If the branch is not associated with an issue, use your initials instead e.g. `tc-fix-profiles`.

## Prerequisites

1. Git
2. Node.js
3. Docker (preferred) or a Postgres server

## Setup Instructions

1. Fork the project's repository on GitHub and clone it to your local system using Git.
   ```bash
   git clone git@github.com:timmyichen/dev-directory.git
   ```
2. Navigate to the project directory in your terminal.
   ```bash
   cd dev-directory
   ```
3. If using Docker, ensure Docker is running and run dependencies
   ```bash
   npm run docker:deps
   ```
   > If you're NOT using Docker, be sure to start your Postgres server.
4. Ensure you are on Node v18.14.0. If you are using NVM, you can run the following to automatically use the correct version.
   ```bash
   nvm use
   ```
5. In a new terminal, run the command `npm ci` to install all the necessary packages for the project.
6. Copy `.env.sample` to `.env` and configure it for your local environment.
7. If it's your first time setting it up, run migrations:

```bash
npm run sequelize-cli db:migrate
```

If you get the error: 'password authentication failed for user "postgres"' while using docker, check to see if postgres is already installed on your computer. If it is, it may interfere with our default docker configuration. If you are familiar with port mapping, you can change the port postgres is using. Otherwise, uninstalling postgres will solve the error.

8. Run `npm run dev` to start the development server.

That's it! You're now ready to start working on the project.

> If using Docker, you can run `docker:db` to log into the Postgres CLI.

## Migrations

When making changes to a model's properties or the database schema, you'll need to create a migration. You can do so via the Sequelize CLI (replace `name-of-migration`):

```bash
npm run sequelize-cli migration:generate --name name-of-migration
```

Edit the migration - see more detailed docs [here](https://sequelize.org/docs/v6/other-topics/migrations/#migration-skeleton)

To run migrations:

```bash
npm run migrate
```

To rollback the last-run migration:

```bash
npm run migrate:undo
```

```bash
   _--_                                    _--_
 /#()# #\                                /# #()#\
 |()##  \#\_       \           /       _/#/  ##()|
 |#()##-=###\_      \         /      _/###=-##()#|
  \#()#-=##  #\_     \       /     _/#  ##=-#()#/
   |#()#--==### \_    \     /    _/ ###==--#()#|
   |#()##--=#    #\_   \!!!/   _/#    #=--##()#|
    \#()##---===####\   X|X   /####===---##()#/
     |#()#____==#####\ / Y \ /#####==____#()#|
      \###______######|\/#\/|######______###/
         ()#O#/      ##\_#_/##      \#O#()
        ()#O#(__-===###/ _ \###===-__)#O#()
       ()#O#(   #  ###_(_|_)_###  #   )#O#()
       ()#O(---#__###/ (_|_) \###__#---)O#()
       ()#O#( / / ##/  (_|_)  \## \ \ )#O#()
       ()##O#\_/  #/   (_|_)   \#  \_/#O##()
        \)##OO#\ -)    (_|_)    (- /#OO##(/
         )//##OOO*|    / | \    |*OOO##\\(
         |/_####_/    ( /X\ )    \_####_\|
        /X/ \__/       \___/       \__/ \X\
       (#/                               \#)
```
