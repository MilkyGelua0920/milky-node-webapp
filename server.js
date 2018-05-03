const dotenv = require('dotenv')
const result = dotenv.config()
 
if (result.error) {
	throw result.error
}

const http = require('http')
const app = require('./app/app.js')
const port = 8080
const server = http.createServer(app)

server.listen(port, () => {
	console.log(`Server running on port ${port}`)
})