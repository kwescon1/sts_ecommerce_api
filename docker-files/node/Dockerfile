# Use the official Node.js 16 image as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies, including devDependencies
RUN npm install


# add user ubuntu, add group ubuntu
RUN useradd -rm -d /home/ubuntu -s /bin/bash -g root -G sudo,www-data -u 1001 ubuntu
RUN groupadd ubuntu


# Make port defined by PORT available to the world outside this container
EXPOSE $PORT

# Define the entrypoint script
ENTRYPOINT ["docker-files/node/entrypoint.sh"]

