// Define simple geometries
const geometries = [{ type: "rectangle", x: 50, y: 50, width: 150, height: 100, stroke: "black", strokeWidth: 2 }]

const svgNS = "http://www.w3.org/2000/svg"
let svgContent = `<svg xmlns="${svgNS}" width="600" height="400">`

const scaleFactor = 1
const corridorWidth = 2

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

function drawLShapedPlan(dimensions = [unitSize * 2 + corridorWidth, 38], unitSize = 8.5, flipped = false) {
	// Draw the L-shaped plan
	const canvas = document.getElementById("drawingCanvas")
	const ctx = canvas.getContext("2d")
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	const { legWidth, legHeight } = dimensions * scaleFactor
	const scaledUnit = unitSize * scaleFactor

	const halfUnit = scaledUnit

	// Function to draw opposing arrays of rectangles
	function drawOpposingRectangles(x, y, length, isVertical) {
		const halfLength = length / 2
		const offset = halfUnit + 2 * scaleFactor // scaled offset

		for (let i = 0; i < halfLength; i += scaledUnit) {
			if (isVertical) {
				ctx.strokeRect(x - offset, y + i, halfUnit, halfUnit)
				ctx.strokeRect(x + offset, y + i, halfUnit, halfUnit)
			} else {
				ctx.strokeRect(x + i, y - offset, halfUnit, halfUnit)
				ctx.strokeRect(x + i, y + offset, halfUnit, halfUnit)
			}
		}
	}

	// Draw the top part of the L
	if (!flipped) {
		drawOpposingRectangles(unitSize, unitSize, unitSize, false)
		ctx.strokeRect(unitSize, 0, 2 * scaleFactor, unitSize)
	}
	strokeRect(20, topH, 2 * scaleFactor, legH)
}

// Updated generateSVG function to apply scale factor to all dimensions
function generateSVG(geometries) {
	geometries.forEach((geometry) => {
		if (geometry.type === "rectangle") {
			svgContent += `<rect x="${geometry.x * scaleFactor}" y="${geometry.y * scaleFactor}" width="${
				geometry.width * scaleFactor
			}" height="${geometry.height * scaleFactor}" fill="transparent" stroke="${
				geometry.stroke || "black"
			}" stroke-width="${(geometry.strokeWidth || 1) * scaleFactor}" />`
		} else if (geometry.type === "circle") {
			svgContent += `<circle cx="${geometry.x * scaleFactor}" cy="${geometry.y * scaleFactor}" r="${
				geometry.radius * scaleFactor
			}" fill="${geometry.color}" />`
		}
	})
	svgContent += `</svg>`
	return svgContent
}

window.addEventListener("load", () => {
	const canvas = document.getElementById("drawingCanvas")
	const ctx = canvas.getContext("2d")

	// Create a checkbox for flipped option
	const flipLabel = document.createElement("label")

	flipLabel.textContent = "Flip plan: "
	const flipCheckbox = document.createElement("input")

	flipCheckbox.type = "checkbox"
	flipLabel.appendChild(flipCheckbox)
	document.body.appendChild(flipLabel)

	if (canvas && canvas.getContext) {
		// Call the new draw plan function with updated 'flipped' parameter
		drawLShapedPlan()
		//geometries.forEach((geometry) => drawGeometry(ctx, geometry))
	} else {
		console.error("Canvas not supported.")
	}

	// Create and append export button for SVG
	const exportBtn = document.createElement("button")
	exportBtn.textContent = "Export SVG"
	document.body.appendChild(exportBtn)

	exportBtn.addEventListener("click", () => {
		// Redraw the plan using the current flipped state before exporting
		drawLShapedPlan({ topWidth: 16, topHeight: 8, legWidth: 5, legHeight: 10 }, 8, flipCheckbox.checked)
		const svgMarkup = generateSVG(geometries)
		// Open the generated SVG in a new window
		const svgWindow = window.open("")
		svgWindow.document.write(svgMarkup)
	})
})
