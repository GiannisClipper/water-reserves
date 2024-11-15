# Use the official Python base image
FROM python:3.12-slim

RUN apt update && apt install curl -y

# FROM python:3.12-alpine
# RUN apk add --no-cache g++ make py3-pip libc6-compat

# Set timezone in your docker image
# https://dev.to/bitecode/set-timezone-in-your-docker-image-d22
RUN apt update && apt install tzdata -y
# RUN apk add --no-cache tzdata
ENV TZ="Europe/Athens"

# Set the working directory inside the container
WORKDIR /backend

# Copy the requirements file to the working directory
COPY ./backend/requirements.txt .

# Install the Python dependencies
RUN pip install -r ./requirements.txt

# Copy the application code to the working directory
COPY ./backend/src ./src
COPY ./backend/tests ./tests
COPY ./backend/resources ./resources

# Expose the port on which the application will run
EXPOSE 8000

# Run the FastAPI application using uvicorn server
CMD [ "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000" ]
