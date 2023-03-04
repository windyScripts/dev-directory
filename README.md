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
4. In a new terminal, run the command `npm ci` to install all the necessary packages for the project.
5. Copy `.env.example` to `.env` and configure it for your local environment.
6. Run `npm run dev` to start the development server.

That's it! You're now ready to start working on the project.

> If using Docker, you can run `docker:db` to log into the Postgres CLI.


TODO
1. Delete this:
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