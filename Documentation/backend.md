# Back-end

To be able to run the application the envarionment variables need to be set. We are just using a simple `.env` file to store the variables.

The `.env` file is ignored by git, so that we dont misstakenly leak any personal information.

To be able to start just create a `.env` file in the root directory of the project and add the following lines:
```env
DB_HOST=<insert database host>
DB_LOGIN=<insert database username>
DB_PASSWORD=<insert database password>
DB_NAME=tract
DB_CHAR=utf8mb4
DB_MULTI=true
REACT_APP_TRACT_API_KEY=<insert api key>
```