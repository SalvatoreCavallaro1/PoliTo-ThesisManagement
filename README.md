# Thesis Management

You can find the images on [Docker Hub](https://hub.docker.com/r/atari2/thesismanagement).

To start the application do the following steps:

1. Copy from the [GitHub repository](https://github.com/Polito-Software-Engineering-2-Group-10/ThesisManagement/blob/docker/docker-compose.yml) the file `docker-compose.yml` or from below.
2. Run `docker compose up` in the same directory as the file `docker-compose.yml`.  

```yaml
version: '3.1'

services:
  db:
    image: atari2/thesismanagement:database
    expose:
      - 5432
    ports:
      - 5433:5432
    healthcheck:
      test: ["CMD", "psql", "-U", "thesismanager", "-d", "thesismanagement", "-c", "SELECT * FROM student, teacher LIMIT 1"]
      interval: 10s
      timeout: 30s
      retries: 5
  authsources:
    image: atari2/thesismanagement:authsources
    volumes:
      - saml_config:/var/www/simplesamlphp/config:rw
    depends_on:
      db:
        condition: service_healthy
  saml:
    image: kenchan0130/simplesamlphp
    depends_on:
      - authsources
    environment:
      SIMPLESAMLPHP_SP_ENTITY_ID: thesismanagement-saml
      SIMPLESAMLPHP_SP_ASSERTION_CONSUMER_SERVICE: http://server:3001/login/callback
      SIMPLESAMLPHP_SP_SINGLE_LOGOUT_SERVICE: http://server:3001/logout/callback
    expose:
      - 8080
    ports:
      - 8080:8080
    volumes:
      - saml_config:/var/www/simplesamlphp/config:ro
  server:
    image: atari2/thesismanagement:backend
    depends_on:
      db:
        condition: service_healthy
    expose:
      - 3001
    ports:
      - 3001:3001
  frontend:
    image: atari2/thesismanagement:frontend
    depends_on:
      - server
    ports:
      - 5173:80
volumes:
  saml_config:
```
