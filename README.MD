# Exercise Project

This test exercise was attempted in both JavaScript and as a Grasshopper plugin, and was completed in around two and a half hours.

**Key Points:**

-   The Grasshopper plugin component was implemented entirely in C# from scratch.
-   The JavaScript version was developed with assistance from the GPT-4o model.
-   There are some unresolved issues with the C# drawing pipeline.

## Dependencies

### Grasshopper Plugin (C#)

-   RhinoCommon
-   Grasshopper SDK
-   .NET Core 7.0

### JavaScript Version

-   Node.js
-   Express.js
-   Nodemon

## Installation

### Grasshopper Plugin (C#)

1. Open the solution in Visual Studio.
2. Build the solutionto the Grasshopper Libraries folder, typically located at:
    ```
    %APPDATA%\Grasshopper\Libraries
    ```
3. Run Rhino using the .NET Core 7.0 runtime, run Grasshopper and load the plugin.

### JavaScript Version

1. Install Node.js and npm.
2. Run `npm install` to install dependencies.
3. Start the server with Nodemon with `npm run dev`.
