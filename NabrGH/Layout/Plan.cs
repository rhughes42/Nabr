using System.Collections.Generic;

using Nabr.Layout;

public class Plan {
	public string Type { get; set; }
	public List<int> Dimensions { get; set; }
	public double CorridorWidth { get; set; }
	public double GridSize { get; set; }
	public List<List<Cell>> Grid { get; private set; }

	public Plan(string type, List<int> dimensions, double corridorWidth, double gridSize) {
		Type = type;
		Dimensions = dimensions;
		CorridorWidth = corridorWidth;
		GridSize = gridSize;
		Grid = GenerateGrid();
	}

	private List<List<Cell>> GenerateGrid() {
		List<List<Cell>> grid = new();

		int rows = Dimensions[0];
		int cols = Dimensions[1];

		for (int i = 0; i < rows; i++) {
			List<Cell> row = new();
			for (int j = 0; j < cols; j++) {
				if (IsInShape(i, j)) {
					row.Add(new Cell());
				} else {
					row.Add(null); // Empty space
				}
			}
			grid.Add(row);
		}

		return grid;
	}

	private bool IsInShape(int row, int col) {
		int arm1Length, arm1Width, arm2Length, arm2Width;

		switch (Type.ToLower()) {
			case "l-shape":
				arm1Length = Dimensions[0] / 2;
				arm1Width = Dimensions[1] / 2;
				arm2Length = Dimensions[0] - arm1Length;
				arm2Width = Dimensions[1] - arm1Width;
				return (row < arm1Length && col < arm1Width) || (row >= arm1Length && col < arm2Width);
			case "mirrored-l-shape":
				arm1Length = Dimensions[0] / 2;
				arm1Width = Dimensions[1] / 2;
				arm2Length = Dimensions[0] - arm1Length;
				arm2Width = Dimensions[1] - arm1Width;
				return (row < arm1Length && col >= (Dimensions[1] - arm1Width)) || (row >= arm1Length && col >= (Dimensions[1] - arm2Width));
			case "u-shape":
				arm1Length = Dimensions[0] / 2;
				arm1Width = Dimensions[1] / 3;
				arm2Length = Dimensions[0] - arm1Length;
				arm2Width = Dimensions[1] - (2 * arm1Width);
				return (row < arm1Length && col < arm1Width) || (row < arm1Length && col >= (Dimensions[1] - arm1Width)) || (row >= arm1Length && col < arm2Width);
			default:
				return true;
		}
	}

	public override string ToString() => $"Type: {Type}, Width: {Dimensions}, Corridor Width: {CorridorWidth}, Grid Size: {GridSize}";
}