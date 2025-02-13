using System;
using System.Drawing;

using Grasshopper.Kernel;

namespace Nabr {
	public class NabrInfo : GH_AssemblyInfo {
		public override string Name => "Nabr";

		//Return a 24x24 pixel bitmap to represent this GHA library.
		public override Bitmap Icon => null;

		//Return a short string describing the purpose of this GHA library.
		public override string Description => "Simple Nabr Grasshopper allotment generator.";

		public override Guid Id => new("4a5c3c1c-109f-4d24-8cbc-07df3399040a");

		//Return a string identifying you or your company.
		public override string AuthorName => "Graph Technologies";

		//Return a string representing your preferred contact details.
		public override string AuthorContact => "tech@graphconsult.xyz";

		//Return a string representing the version.  This returns the same version as the assembly.
		public override string AssemblyVersion {
			get {
				Version version = GetType().Assembly.GetName().Version;

				return version != null ? version.ToString() : "Not Found!";
			}
		}
	}
}