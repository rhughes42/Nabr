/**
 * @fileoverview Server setup for the NabrJS application.
 * This file configures and starts an Express server to serve static files and handle routing.
 */

const express = require("express")
const path = require("path")

const app = express()
const port = process.env.PORT || 3000

/**
 * Serve static files from the public folder.
 */
app.use(express.static(path.join(__dirname, "../public")))

/**
 * Default route fallback.
 * Sends the index.html file for any unspecified routes.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../public/index.html"))
})

/**
 * Start the server and listen on the specified port.
 * Logs a message to the console once the server is running.
 */
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
