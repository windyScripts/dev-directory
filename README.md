# Dev Directory

This is a service for a community of devs to networkm, built by 100Devs for 100Devs.
Discussion can be found on the [Discord Thread](https://discord.com/channels/735923219315425401/1080598293538672700).

# Developing

// PROOF READ BEFORE COMMITING
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
npx sequelize-cli db:migrate
```
8. Run `npm run dev` to start the development server.

That's it! You're now ready to start working on the project.

> If using Docker, you can run `docker:db` to log into the Postgres CLI.

## Migrations

When making changes to a model's properties or the database schema, you'll need to create a migration.  You can do so via the Sequelize CLI (replace `name-of-migration`):

```bash
npx sequelize-cli migration:generate --name name-of-migration
```

Edit the migration - see more detailed docs [here](https://sequelize.org/docs/v6/other-topics/migrations/#migration-skeleton)

To run migrations:
```bash
npx sequelize-cli db:migrate
```

To rollback the last-run migration:
```bash
npx sequelize-cli db:migrate:undo
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