This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Practice App: Using React-Express-MongoDB-Mongoose

Troubleshooting: 
- to send info in the body of a request, install `body-parser` npm package and require/call it in server.js file
- remember to add `"proxy": "http://localhost:8080",` to package.json so, during development, app knows the react localhost:3000 port is connected to the database localhost:8080 port
- When destructuring, only call the things you want (i.e. BrowserRouter as Link will not work, gives the multiple children error)
- A router may only have one child element, so if you have more than one Route, you need to encase them all in a div