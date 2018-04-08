This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Practice App: Using React-Express-MongoDB-Mongoose

Troubleshooting: 
- to send info in the body of a request, install `body-parser` npm package and require/call it in server.js file
- remember to add `"proxy": "http://localhost:8080",` to package.json so, during development, app knows the react localhost:3000 port is connected to the database localhost:8080 port
- `{ BrowserRouter as Router, Link }` means you are importing BrowserRouter but calling it with `Router` . You are *also* importing link but calling it as `Link`. `{ BrowserRouter as Link }` is going to import BrowserRouter again when you use `Link` and you will get the "too many children" error. Just use `{ Link }`. 
- A router may only have one child element, so if you have more than one Route, you need to encase them all in a div
- Do not forget `this.` when you are using props! `props.function` will not work. You need `this.props.function`.
- node process already running? `killall node`