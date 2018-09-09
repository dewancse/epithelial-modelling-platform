# 'node' official image, with the carbon branch
FROM node:carbon

# this app listens on port 8080, but the container should launch on port 80
# so it will respond to http://localhost:80 on your computer
EXPOSE 80

# create directory /usr/src/app for app files with 'mkdir -p /usr/src/app'
RUN mkdir -p /usr/src/app

# Node uses a "package manager", so it needs to copy in package.json file
WORKDIR /usr/src/app
COPY package.json package.json

# run 'npm install' to install dependencies from that file
RUN npm install

# copy in all files from current directory
COPY . .

# start container with command 'npm start'
CMD ["npm", "start"]
