# Use the official Node.js image
FROM node:18-alpine as builder

    RUN apk add --no-cache g++ make py3-pip libc6-compat

    # Set timezone in docker image
    RUN apk add --no-cache tzdata
    ENV TZ="Europe/Athens"

    # Set the working directory inside the container
    WORKDIR /frontend

    # Copy the dependencies description files to the working directory
    COPY ./frontend/package*.json ./

    # Install the dependencies
    RUN npm ci

    # Copy the settings files and the application code to the working directory
    COPY ./frontend/next.config.mjs ./
    COPY ./frontend/postcss.config.mjs ./
    COPY ./frontend/tailwind.config.ts ./
    COPY ./frontend/tsconfig.json ./
    COPY ./frontend/src ./src
    COPY ./frontend/public ./public

    # Build the nextjs app
    RUN npm run build


# Use the official Node.js image
FROM node:18-alpine AS production

    RUN apk add --no-cache curl

    # Set the working directory
    WORKDIR /frontend

    # Copy the built files from the builder stage
    COPY --from=builder /frontend ./

    # Install only production dependencies
    RUN npm ci --only=production

    # Expose the port the app runs on
    EXPOSE 3000

    # Start the Next.js app
    CMD [ "npm", "start" ]
