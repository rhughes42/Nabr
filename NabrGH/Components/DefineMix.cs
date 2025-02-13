using System;
using System.Collections.Generic;

using Grasshopper.Kernel;

using Nabr.Layout;

// ReSharper disable InconsistentNaming

namespace Nabr.Components {
	public class DefineMix : GH_Component {
		/// <summary>
		/// Initializes a new instance of the DefineMix class.
		/// </summary>
		public DefineMix()
		  : base("Define Mix", "Mix",
			  "Define the proportional mix of units.",
			  "Nabr", "Layout") {
		}

		/// <summary>
		/// Registers all the input parameters for this component.
		/// </summary>
		protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager) {
			int type = pManager.AddTextParameter("Cell Type", "Type", "The type of cell to define.", GH_ParamAccess.list);
			int density = pManager.AddNumberParameter("Density", "Density", "The density of the cell type.", GH_ParamAccess.list);
		}
		/// <summary>
		/// Registers all the output parameters for this component.
		/// </summary>
		protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager) => pManager.AddGenericParameter("Mix", "Mix", "The mix density to aim for.", GH_ParamAccess.item);

		/// <summary>
		/// This is the method that actually does the work.
		/// </summary>
		/// <param name="DA">The DA object is used to retrieve from inputs and store in outputs.</param>
		protected override void SolveInstance(IGH_DataAccess DA) {
			List<string> type = new();
			List<double> density = new();

			if (!DA.GetDataList(0, type)) {
				return;
			}

			if (!DA.GetDataList(1, density)) {
				return;
			}

			if (type.Count != density.Count) {
				AddRuntimeMessage(GH_RuntimeMessageLevel.Warning, "The number of cell types and densities must be the same.");
				GlobalLogger.AddLog("The number of cell types and densities must be the same.");
				return;
			}

			Mix mix = new(type, density);

			GlobalLogger.AddLog($"Mix defined: {mix}");

			bool _ = DA.SetData(0, mix);
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
			get { return new Guid("660202D2-6A74-4840-AC25-E64923A283EA"); }
		}
	}
}