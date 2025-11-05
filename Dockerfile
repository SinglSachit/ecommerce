#Node js install
#project setup
#package install
# build
#run
#use official Node.js LTS image as the base image
FROM node:22-alpine

#set the workinf directory inside the countainer
WORKDIR /app

#copy package.json and package-json to the working directory

COPY package*.json ./
#INSTALL project dependencies
RUN npm install

#copy the rest os the application code to the working directory
COPY . .
 # build the application
 RUN npm run build

 #expose the port the app runs on
 EXPOSE 3000
 #start Application
  CMD ["node","dist/main.js"]
