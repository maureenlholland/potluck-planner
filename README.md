This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

# Practice App: Using React-Express-MongoDB

## Troubleshooting: 

### Node
[Common errors](https://nodejs.org/api/errors.html#errors_common_system_errors)
- `killall node` is a useful command

### Express
- to send info in the body of a request, install `body-parser` npm package and require/call it in server.js file
- if you are using `router` as well, be sure to call it **after** body-parser
- `routes` folder needs `index.js` file
- routers declared in `index.js` will prefix all routes within their respective files 
	- For example: 
	- Inside `routes/index.js` file: `router.use('/auth', require('./auth'));` 
	- Inside `routes/auth.js:` `/login`
	- Axios call: `/auth/login`

### React
- `{ BrowserRouter as Router, Link }` means you are importing BrowserRouter but calling it with `Router` . You are *also* importing link but calling it as `Link`. `{ BrowserRouter as Link }` is going to import BrowserRouter again when you use `Link` and you will get the "too many children" error. Just use what you need. 
- A router may only have one child element, so if you have more than one Route, you need to encase them all in a div
- Do not forget `this.` When you are using props, `props.function` will not work. You need `this.props.function`.

### Mongoose

### Other
- remember to add `"proxy": "http://localhost:8080",` to package.json so, during development, app knows the react localhost:3000 port is connected to the database localhost:8080 port
