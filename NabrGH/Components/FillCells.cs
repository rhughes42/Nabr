using System;
using System.Collections.Generic;
using System.Linq;

using Grasshopper.Kernel;

using Nabr.Layout;

using Rhino.Geometry;

// ReSharper disable InconsistentNaming

namespace Nabr.Components {
	public class FillCells : GH_Component {
		/// <summary>
		/// Initializes a new instance of the FillCells class.
		/// </summary>
		public FillCells()
		  : base("FillCells", "Fill",
			  "Fill the grid with cells dependent on the desired mix.",
			  "Nabr", "Layout") {
		}

		/// <summary>
		/// Registers all the input parameters for this component.
		/// </summary>
		protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager) {
			int plan = pManager.AddGenericParameter("Plan", "Plan", "The plan object, with empty grid cells.", GH_ParamAccess.item);
			int cells = pManager.AddGenericParameter("Cells", "Cells", "The cell types to fill the plan with.", GH_ParamAccess.list);
			int mix = pManager.AddGenericParameter("Mix", "Mix", "The mix density to aim for.", GH_ParamAccess.item);
		}

		/// <summary>
		/// Registers all the output parameters for this component.
		/// </summary>
		protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager) => pManager.AddCurveParameter("Cells", "Cells", "The cell outlines for the desired mix.", GH_ParamAccess.list);

		/// <summary>
		/// This is the method that actually does the work.
		/// </summary>
		/// <param name="DA">The DA object is used to retrieve from inputs and store in outputs.</param>
		protected override void SolveInstance(IGH_DataAccess DA) {
			Plan plan = null;
			List<Cell> cells = new();
			Mix mix = null;

			if (!DA.GetData(0, ref plan)) {
				return;
			}

			if (!DA.GetDataList(1, cells)) {
				return;
			}

			if (!DA.GetData(2, ref mix)) {
				return;
			}

			GlobalLogger.AddLog($"Attempting to fill cells for plan: {plan} with mix: {mix} and cells: {cells}");

			// Implement the rectangle packing algorithm
			List<Rectangle3d> packedCells = new();
			Dictionary<string, double> cellDistribution = (Dictionary<string, double>)mix.GetAllDensities();

			foreach (Cell cellType in cells) {
				if (!cellDistribution.TryGetValue(cellType.UnitType, out double typeDensity)) {
					continue;
				}

				int count = (int)(typeDensity * plan.Grid.Count); // Assuming plan.Grid.Count gives the total number of cells in the plan.
				for (int i = 0; i < count; i++) {
					Rectangle3d rect = new(Plane.WorldXY, cellType.Width, cellType.Length);
					packedCells.Add(rect);
				}
			}

			// Fill the plan with the packed cells
			List<Curve> cellOutlines = packedCells.Select(rect => rect.ToNurbsCurve()).Cast<Curve>().ToList();

			bool unused = DA.SetDataList(0, cellOutlines);
		}

		/// <summary>
		/// Provides an Icon for the component.
		/// </summary>
		protected override System.Drawing.Bitmap Icon {
			get {
				//You can add image files to your project resources and access them like this:
				// return Resources.IconForThisComponent;
				return null;
			}
		}

		/// <summary>
		/// Gets the unique ID for this component. Do not change this ID after release.
		/// </summary>
		public override Guid ComponentGuid {
			get { return new Guid("C7C1FEC3-F233-47C2-961F-07ED94B64F2D"); }
		}
	}
}