/**
 * @fileoverview Drawing utilities for the NabrJS application.
 * This file contains functions to draw geometric shapes on a canvas element
 * and generate SVG representations of these shapes.
 */

/**
 * An array of geometry objects to be drawn.
 * Each object represents a geometric shape with specific properties.
 * @type {Array<Object>}
 */
const geometries = [{ type: "rectangle", x: 50, y: 50, width: 150, height: 100, stroke: "black", strokeWidth: 2 }]

// SVG namespace for creating SVG elements.
const svgNS = "http://www.w3.org/2000/svg"
let svgContent = `<svg xmlns="${svgNS}" width="500" height="400">`

// Global variables for plan dimensions and unit size.
const scaleFactor = 1
const corridorWidth = 2

/**
 * Draws a geometric shape on the provided canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context to draw on.
 * @param {Object} geometry - The geometry object defining the shape to draw.
 */
function drawGeometry(ctx, geometry) {
	// Set stroke style and line width for outlines
	ctx.strokeStyle = geometry.stroke || "black"
	ctx.lineWidth = geometry.strokeWidth || 1
	if (geometry.type === "rectangle") {
		ctx.strokeRect(geometry.x, geometry.y, geometry.width, geometry.height)
	} else if (geometry.type === "circle") {
		ctx.beginPath()
		ctx.arc(geometry.x, geometry.y, geometry.radius, 0, Math.PI * 2)
		ctx.stroke()
	}
}

/**
 * Draws a simple L-shaped plan on a canvas.
 * The horizontal corridor has dimensions: length x width,
 * and the vertical leg is drawn below with dimensions: width x length.
 *
 * @param {number} length - The number of units for the long side.
 * @param {number} width - The number of units for the short side.
 * @param {number} [unitSize=8.5] - The size of each unit.
 * @param {boolean} [flipped=false] - Optional flipped state.
 */
function drawLShapedPlan(length, width, unitSize = 8.5, flipped = false) {
	const canvas = document.getElementById("drawingCanvas")
	const ctx = canvas.getContext("2d")
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	const scaledUnit = unitSize * scaleFactor

	// Draw horizontal corridor (top rectangle)
	ctx.strokeRect(0, 0, length * scaledUnit, width * scaledUnit)

	// Draw vertical leg (attached below the horizontal part)
	ctx.strokeRect(0, width * scaledUnit, width * scaledUnit, length * scaledUnit)

	// Optional: handle flipped state if desired
	if (flipped) {
		// ...flipped drawing logic if desired...
	}
}

/**
 * Creates an array of square objects representing an L-shaped grid.
 * Horizontal corridor: rows = width, cols = length.
 * Vertical leg: rows = length, cols = width, offset vertically by (width).
 *
 * @param {number} length - Number of squares along the long side.
 * @param {number} width - Number of squares along the short side.
 * @param {number} [squareSize=8.5] - Size of each square.
 * @returns {Array<Object>} Array of square objects with x, y, width, and height.
 */
function createLShapedGrid(length, width, squareSize = 8.5) {
	const squares = []
	const scaledSize = squareSize * scaleFactor
	// Horizontal corridor
	for (let row = 0; row < width; row++) {
		for (let col = 0; col < length; col++) {
			squares.push({
				x: col * scaledSize,
				y: row * scaledSize,
				width: scaledSize,
				height: scaledSize,
			})
		}
	}
	// Vertical leg (attached below the corridor)
	for (let row = 0; row < length; row++) {
		for (let col = 0; col < width; col++) {
			squares.push({
				x: col * scaledSize,
				y: (width + row) * scaledSize,
				width: scaledSize,
				height: scaledSize,
			})
		}
	}
	return squares
}

/**
 * Draws the L-shaped grid to the canvas.
 *
 * @param {number} length - Number of squares along the long side.
 * @param {number} width - Number of squares along the short side.
 * @param {number} [squareSize=8.5] - Size of each square.
 */
function drawLShapedGrid(length, width, squareSize = 8.5) {
	const canvas = document.getElementById("drawingCanvas")
	const ctx = canvas.getContext("2d")
	const squares = createLShapedGrid(length, width, squareSize)
	squares.forEach((square) => {
		ctx.strokeRect(square.x, square.y, square.width, square.height)
	})
}

/**
 * Draws a grid of squares on the canvas.
 *
 * @param {number} gridCount - The number of squares in each row and column.
 * @param {number} [squareSize=8.5] - The size of each square.
 */
function drawGrid(gridCount, squareSize = 8.5) {
	const canvas = document.getElementById("drawingCanvas")
	const ctx = canvas.getContext("2d")

	const scaledSize = squareSize * scaleFactor
	const offsetX = 0
	const offsetY = 0

	for (let i = 0; i < gridCount; i++) {
		for (let j = 0; j < gridCount; j++) {
			ctx.strokeRect(offsetX + j * scaledSize, offsetY + i * scaledSize, scaledSize, scaledSize)
		}
	}
}

/**
 * Generates an SVG string based on the provided geometries.
 *
 * @param {Array} geometries - An array of geometry objects to be converted into SVG elements.
 * @returns {string} The generated SVG string.
 */
function generateSVG(geometries) {
	geometries.forEach((geometry) => {
		if (geometry.type === "rectangle") {
			svgContent += `<rect x="${geometry.x * scaleFactor}" y="${geometry.y * scaleFactor}" width="${
				geometry.width * scaleFactor
			}" height="${geometry.height * scaleFactor}" fill="transparent" stroke="${
				geometry.stroke || "black"
			}" stroke-width="${(geometry.strokeWidth || 1) * scaleFactor}" />`
		}
	})
	svgContent += `</svg>`
	return svgContent
}

/**
 * Event listener for the window load event.
 * Sets up the drawing canvas and adds an export button for SVG generation.
 * Also adds a checkbox for flipping the L-shaped plan.
 * Calls the drawLShapedPlan function to draw the initial plan.
 */
window.addEventListener("load", () => {
	const canvas = document.getElementById("drawingCanvas")
	const ctx = canvas.getContext("2d")

	// Draw initial plans
	if (canvas && canvas.getContext) {
		// Use new parameters: length = 16, width = 8.
		drawLShapedPlan(16, 8, 8.5, false)
		drawLShapedGrid(16, 8, 8.5)
	} else {
		console.error("Canvas not supported.")
	}

	// Create container for controls and append it below canvas
	const controlsDiv = document.getElementById("controlsDiv")
	controlsDiv.style.marginTop = "10px"

	// Add three text inputs with labels for % 1 BR, % 2 BR and % 3 BR
	const inputs = [
		{ label: "% 1 BR:", id: "oneBR" },
		{ label: "% 2 BR:", id: "twoBR" },
		{ label: "% 3 BR:", id: "threeBR" },
	]
	inputs.forEach((item) => {
		const inputLabel = document.createElement("label")
		inputLabel.textContent = item.label + " "

		const inputField = document.createElement("input")

		inputField.type = "text"
		inputField.id = item.id
		// Make text boxes narrower
		inputField.style.width = "50px"
		inputLabel.style.marginLeft = "10px"

		inputLabel.appendChild(inputField)
		controlsDiv.appendChild(inputLabel)
	})

	// Create a checkbox for flipped option
	const flipLabel = document.createElement("label")
	flipLabel.textContent = "Flip plan: "
	flipLabel.style.marginLeft = "10px"

	const flipCheckbox = document.createElement("input")
	flipCheckbox.type = "checkbox"
	flipCheckbox.style.marginLeft = "5px"

	flipLabel.appendChild(flipCheckbox)
	controlsDiv.appendChild(flipLabel)

	// Create export button for SVG
	const exportBtn = document.createElement("button")
	exportBtn.textContent = "Export SVG"
	controlsDiv.appendChild(exportBtn)

	// Append controls after the canvas
	canvas.parentNode.insertBefore(controlsDiv, canvas.nextSibling)

	exportBtn.addEventListener("click", () => {
		// Redraw the plan using the current flipped state before exporting
		drawLShapedPlan(16, 8, 8.5, flipCheckbox.checked)
		const svgMarkup = generateSVG(geometries)
		const svgWindow = window.open("")
		svgWindow.document.write(svgMarkup)
		svgWindow.document.close()
	})
})
