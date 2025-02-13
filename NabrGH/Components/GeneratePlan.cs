using System;
using System.Collections.Generic;

using Grasshopper.Kernel;

// ReSharper disable InconsistentNaming

namespace Nabr.Components {
	public class GeneratePlan : GH_Component {

		public GeneratePlan()
: base("Generate Plan", "Plan",
			"Generate a plan based on a type and dimensions.",
			"Nabr", "Layout") {
		}

		/// <summary>
		/// Registers all the input parameters for this component.
		/// </summary>
		protected override void RegisterInputParams(GH_InputParamManager pManager) {
			int type = pManager.AddTextParameter("Type", "Type", "The type (L, Mirrored L or U) of plan to draw.", GH_ParamAccess.item, "L");
			int dims = pManager.AddIntegerParameter("Width", "Dims", "The length of each 'arm' of the plan in units.", GH_ParamAccess.list, new List<int>() { 10, 5 });
			int corridor = pManager.AddNumberParameter("CorridorWidth", "Corridor", "The width of the corridor in metres.", GH_ParamAccess.item, 2);
			int grid = pManager.AddNumberParameter("Grid Size", "Grid", "The grid dimension on which to base the system, in metres.", GH_ParamAccess.item, 8.5);

			pManager[0].Optional = true; // Defaults to L
			pManager[1].Optional = true; // Defaults to 10 x 5 units.
			pManager[2].Optional = true; // Defaults to 2m
			pManager[3].Optional = true; // Defaults to 8.5m
		}

		/// <summary>
		/// Registers all the output parameters for this component.
		/// </summary>
		protected override void RegisterOutputParams(GH_OutputParamManager pManager) => pManager.AddGenericParameter("Plan", "Plan", "The plan object, with empty grid cells.", GH_ParamAccess.item);

		/// <summary>
		/// This is the method that actually does the work.
		/// </summary>
		/// <param name="DA">The DA object can be used to retrieve data from input parameters and 
		/// to store data in output parameters.</param>
		protected override void SolveInstance(IGH_DataAccess DA) {
			string type = "L";
			List<int> dimensions = new() {
									10,
									5

							};
			double corridorWidth = 2;
			double gridSize = 8.5;

			if (!DA.GetData(0, ref type)) {
				return;
			}

			if (!DA.GetDataList(1, dimensions)) {
				return;
			}

			if (!DA.GetData(2, ref corridorWidth)) {
				return;
			}

			if (!DA.GetData(3, ref gridSize)) {
				return;
			}

			GlobalLogger.AddLog($"Attempting to generate a plan of type: {type} with dimensions: {dimensions}, corridor width: {corridorWidth} and grid size: {gridSize}");

			// Create a new Plan object
			Plan plan = new(type, dimensions, corridorWidth, gridSize);

			// Set the output parameter
			bool _ = DA.SetData(0, plan);
		}

		/// <summary>
		/// Provides an Icon for every component that will be visible in the User Interface.
		/// Icons need to be 24x24 pixels.
		/// You can add image files to your project resources and access them like this:
		/// return Resources.IconForThisComponent;
		/// </summary>
		protected override System.Drawing.Bitmap Icon => null;

		/// <summary>
		/// Each component must have a unique Guid to identify it. 
		/// It is vital this Guid doesn't change otherwise old ghx files 
		/// that use the old ID will partially fail during loading.
		/// </summary>
		public override Guid ComponentGuid => new("07daa510-4fc0-48fc-964b-6e3da256db89");
	}
}