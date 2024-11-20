# README
# Walking skeleton is down at the bottom.

## Project Overview

This project is a web application that allows users to interact with various quiz topics, answer questions, and manage quiz-related content. It uses a layered architecture with a frontend for user interaction, a backend for handling requests, and a database for storing data. The application supports features like user registration, login, topic and question creation, and automated grading.

The main components of the project are:

1. **Users**: Users can register, login, and interact with quiz topics. Admins have extra privileges like adding or removing topics and questions.
2. **Topics**: Admins create topics, and users can participate in quizzes related to these topics.
3. **Questions**: Questions are tied to specific topics, and users can answer them.
4. **Answers**: Users submit answers to questions, and the system can automatically grade responses.

## Features

- **User Registration & Login**: Secure authentication with password hashing.
- **Topic Management**: Admin users can create and delete topics.
- **Question Management**: Admin users can add questions to topics.
- **Answer Options**: Users can answer questions, with options marked as correct or incorrect.
- **Automated Grading**: Users receive feedback on whether their answers are correct or incorrect.
- **API**: Provides endpoints for querying random questions and submitting answers.
- **CSS Styling**: Uses a CSS framework to ensure a consistent user interface.

## Database Schema

The database consists of the following tables:

1. **Users**: Contains user information, including email, password, and admin status.
2. **Topics**: Stores topics that users can participate in. Admins can create and delete topics.
3. **Questions**: Stores questions related to specific topics.
4. **Question Answer Options**: Contains answer options for each question, including correctness information.
5. **Question Answers**: Records the answers users submit for each question.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Docker
- Docker Compose

### Running Locally

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Start the application with Docker Compose:

   ```bash
   docker-compose up
   ```

   This command will start the application and initialize the database. The application will be available at [http://localhost:7777](http://localhost:7777).

3. The admin account will be pre-configured with the following credentials:
   - Email: `admin@admin.com`
   - Password: `123456`

### Project Structure

- **docker-compose.yml**: Docker Compose configuration file.
- **README.md**: Project documentation.
- **drill-and-practice/**: Application code, including views, controllers, and services.
- **flyway/sql/**: SQL scripts used to initialize the database.
- **run-locally.js**: Script to launch the application locally.
- **deps.js**: Defines the project dependencies.

### Running Tests

To run the automatic tests for the project, execute the following command:
Before running the test make sure that the path is matching and you can also edit the path as per the availability of data.
```bash
docker compose run --entrypoint=npx e2e-playwright playwright test
```

Tests should include at least ten meaningful tests, such as end-to-end tests, which verify the functionality of core features.

### Deployment

By default, the application is launched on port `7777` when using `docker-compose up`. The application should also be available at an online URL (e.g., Fly.io), and the URL will be provided in this section if deployed.

## API Endpoints

The following API endpoints are available:

- **GET /api/questions/random**: Retrieves a random question from the database in JSON format.
- **POST /api/questions/answer**: Submits an answer to a random question. Returns a JSON document indicating whether the answer was correct.

Example response for **GET /api/questions/random**:

```json
{
  "questionId": 1,
  "questionText": "How much is 1+1?",
  "answerOptions": [
    { "optionId": 1, "optionText": "2" },
    { "optionId": 2, "optionText": "4" },
    { "optionId": 3, "optionText": "6" }
  ]
}
```

Example request body for **POST /api/questions/answer**:

```json
{
  "questionId": 1,
  "optionId": 2
}
```

Example response for **POST /api/questions/answer**:

```json
{
  "correct": true
}
```

### Access Control

- **Authorized Access**: Only authenticated users can access `/topics` and `/quiz`.
- **Public Access**: Anyone can visit `/`, `/auth`, and `/api`.

## Application Navigation

### Main Page

- Accessible at `/`, this page provides links to register, login, and view application statistics, such as the number of topics, questions, and answers.

### Topics Page

- Accessible at `/topics`, it lists all available topics. Admin users can add or delete topics.
- Each topic is linked to a detailed page where questions can be added or viewed.

### Quiz Page

- Accessible at `/quiz`, users can view available topics and take quizzes.
- When a quiz is started, a random question is selected, and users can choose an answer. Feedback is provided based on the correctness of their answers.

### Registration and Login

- **Registration**: Accessible at `/auth/register`, where users provide an email and password to register.
- **Login**: Accessible at `/auth/login`, where users can log in with their credentials.

## Testing

The project includes automatic tests that can be run using the `npm test` command. Tests include verifying user registration, topic creation, question answering, and API functionality.

## Conclusion

This project demonstrates a fully-functional quiz application with a layered architecture, user management, topic and question handling, and automated grading. It is designed with scalability in mind and can be extended to include additional features like user rankings, more question types, and integrations with other systems.





# Walking skeleton

This is a walking skeleton -- a starting point for working on the course
assignments -- for the free online Web Software Development course available at
[https://fitech101.aalto.fi/web-software-development/](https://fitech101.aalto.fi/web-software-development/).

## Contents

The walking skeleton has a simple Deno application that starts on port `7777`.
The application responds to queries with the message `Hello world!` and logging
the contents of the database table `names` to the console.

Launching the walking skeleton starts the Deno application, a PostgreSQL server,
and a database migration process (Flyway).

## Starting and shutting down

The walking skeleton is used with Docker Compose.

- To start the walking skeleton, open up the terminal in the folder that
  contains the `docker-compose.yml` file and type `docker compose up`.
- To stop the walking skeleton, press `ctrl+C` (or similar) in the same terminal
  where you wrote the command `docker compose up`. Another option is to open up
  a new terminal and navigate to the folder that contains the
  `docker-compose.yml` file, and then write `docker compose stop`.

## Watching for changes

The walking skeleton by default watches for changes in the Deno code and
restarts the application whenever needed. There is a
[bug](https://github.com/denoland/deno/issues/6966), however, that leads to this
functionality not working in Windows Subsystem for Linux. When working with WSL,
stop and start the container between changes.

## Database

When the walking skeleton is up and running, you can access the PostgreSQL
database from the terminal using the following command:

```
docker exec -it multi-choice-questions psql -U username database
```

This opens up `psql` console, where you can write SQL commands.

## Database migrations

When the walking skeleton is started, Flyway is used to run the SQL commands in
the database migration files that reside in the `flyway/sql`-folder. If a
database exists, Flyway checks that the schema corresponds to the contents of
the database migration files.

If you need new database tables or need to alter the schema, the correct
approach is to create a new migration file and start the walking skeleton.
Another approach is to modify the existing migration file -- if you do this, the
migrations fail, however.

If you end up altering the migration files (or the schema in the database), you
can clean up the database (remove the existing database tables) by stopping the
containers and the related volumes -- with the database data -- with the command
`docker compose down`. When you launch the walking skeleton again after this,
the database is newly created based on the migration files.

## Deno cache

When we launch a Deno application, Deno loads any dependencies that the
application uses. These dependencies are then stored to the local file system
for future use. The walking skeleton uses the `app-cache`-folder for storing the
dependencies. If you need to clear the cache, empty the contents of the folder.

## The project.env file

Database and Deno cache configurations are entered in the `project.env` file,
which Docker uses when starting the walking skeleton. If you deploy the
application, you naturally do not wish to use the file in this repository.
Instead, create a new one that is -- as an example -- only available on the
server where the application is deployed. Another option is to use secrets --
we'll discuss these briefly in the course, where this walking skeleton is used.

## VSCode configurations

The walking skeleton also comes with a few default VSCode settings. These
settings can be found in the `settings.json` file in the `.vscode` folder. By
default, we assume that you have the VSCode Deno plugin.

## E2E Tests with playwright

The walking skeleton comes also with simple
[Playwright](https://playwright.dev/) configuration that provides an easy
approach for building end-to-end tests. Check out the folder `tests` within
`e2e-playwright` to get started.

To run E2E tests, launch the project using the following command:

```
docker compose run --entrypoint=npx e2e-playwright playwright test && docker compose rm -sf
```

Note! Once finished, this will also remove any changes to the database of your
local project.

What the e2e tests effectively do is that they start up a browser within the
docker container and examine the application programmatically based on the
tests.

(This isn't yet discussed in the materials, but will be sooner or later!)
