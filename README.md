# Team 5 project
[![CircleCI](https://circleci.com/gh/abodsakah/Tract/tree/main.svg?style=svg)](https://circleci.com/gh/abodsakah/Tract/tree/main)
<br>
This is the main repository for the project of Team 5 at BTH for the course PA1416.

### Setup

Start by cloning the repository:
```bash
git clone https://github.com/abodsakah/Tract
```

Go into the directory:
```bash
cd Tract
```

And from there you can start by installing the dependencies by running the `yarn` command, if you dont have yarn already installed, you can install it by running the following command:
```bash
npm install -g yarn
```

After everything is done you can start the application by running the following command:
```bash
yarn start
```

and that would open a new window in your default browser. But if dosnt you can just open your browser and type in the following url `http://localhost:3000/`.

### Docker
To start the docker container you need docker and docker compose installed. You can read more about them with installing instructions [here](https://docs.docker.com/compose/install/).

To run the project just go into the projects directory and run the following command:
```bash
docker-compose up -d
```
To close all the containers run
```bash
docker-compose down -v
```

It can take some time for the database to run.
included in the docker-compose.yml file:
- nodejs
- mysql
- phpmyadmin
- eclipse-mosquitto

You can access phpmyadmin to manpulate the database by going to the following url `http://localhost:8080/`.

the username is `root` and the password is `12345678`.

For the react application you can access it by going to the following url `http://localhost:3000/`.

To be able to run the application or the docker container you need to setup the backend and the environment variables you can do that by following the instructions in [here](https://github.com/abodsakah/Tract/blob/main/Documentation/backend.md).

Thats it!

# Docs
[Front end](https://github.com/abodsakah/Team-5/blob/main/Documentation/frontend.md)
