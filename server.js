const config = require("config");
const ejs = require("ejs");
const express = require("express");
const fs = require("fs");
const os = require("os");
const path = require("path");
const pino = require("pino-http");

// Instantiate logger
const logConfig = {
  level: config.get("app.logLevel"),
  name: config.get("app.name"),
};
const logger = pino(logConfig);

// Instantiate Express app, mount logger and error handling middleware
const app = express();
app.use(logger);

let servePath;

// Define helper function for health check
const buildMemoryMB = () => {
  const memoryFormatted = {};
  // Get memory values
  const memoryRaw = process.memoryUsage();
  // For each memory value, calculate in MB and mount it on result, then return result
  for (const key in memoryRaw) {
    memoryFormatted[key] = `${
      Math.round((memoryRaw[key] / 1024 / 1024) * 100) / 100
    } MB`;
  }
  return memoryFormatted;
};

function mountHealthCheck(app, options = null) {
  // Mount route for health check
  app.get("/health-check", (req, res) => {
    const [one, five, fifteen] = os.loadavg();
    const healthDetails = {
      app: {
        environment: process.env["NODE_ENV"],
        logLevel: logConfig.level,
        name: logConfig.name,
        ...options,
        port: config.get("app.port"),
      },
      process: {
        cpuUsage: process.cpuUsage,
        memory: buildMemoryMB(),
        uptime: process.uptime(),
        version: process.version,
      },
      system: {
        freemem: os.freemem(),
        loadavg: { 1: one, 5: five, 15: fifteen },
        timestamp: new Date().toISOString(),
        uptime: os.uptime(),
      },
    };
    req.log.info(healthDetails);
    res.send(healthDetails);
  });
}

//  Mount route for simulating error
app.get("/error", function (req, res, next) {
  next(new Error("kaboom"));
});

// If Prod, mount health check and configure static server
if (process.env.NODE_ENV === "production") {
  mountHealthCheck(app);
  servePath = config.get("app.staticFolder");
  app.use(express.static(servePath));
}
// Else Dev, configure SSR server
else {
  // Calculate theme folder
  const theme = process.env.THEME || config.get("app.defaultTheme");
  const themePath = path.join(config.get("app.themesFolder"), theme);
  servePath = themePath;

  // Setup template engine
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, themePath));

  // Load theme config
  const themeConfig = JSON.parse(
    fs.readFileSync(`${themePath}/config/theme.json`),
  );
  const themeData = JSON.parse(
    fs.readFileSync(`${themePath}/config/data.json`),
  );

  // Mount health check for dev server
  mountHealthCheck(app, {
    theme,
    themeConfig,
    themePath,
  });

  // Define view helpers
  const buildLocals = (req) => {
    // If ?flavor param and flavor config exists, load it and merge it into locals, else return locals unchanged
    if (
      req.query.flavor &&
      fs.existsSync(
        `${themePath}/config/flavor-${req.query.flavor.toLowerCase()}.json`,
      )
    ) {
      const flavorConfig = JSON.parse(
        fs.readFileSync(
          `${themePath}/config/flavor-${req.query.flavor.toLowerCase()}.json`,
        ),
      );
      const locals = Object.assign(
        {},
        { req },
        themeConfig,
        flavorConfig,
        themeData,
        { ext: "" },
      );
      return locals;
    }
    return Object.assign({}, { req }, themeConfig, themeData, { ext: "" });
  };

  const renderTemplate = (req, res, template_slug) => {
    res.render(template_slug, buildLocals(req));
  };

  // Mount route for 'When user requests an ejs file, reject it with a bare 404'
  app.get("/*.ejs", (req, res) => {
    res.sendStatus(404);
  });

  // Mount middleware for serving static files if they exist
  app.use(express.static(themePath));

  // Mount route for 'When user requests base domain, serve the homepage template'
  app.get("/", (req, res) => {
    renderTemplate(req, res, config.get("app.homeTemplate"));
  });

  // Mount route for 'When user requests a css file, try to dynamically render it'
  app.get("/css/:filename", (req, res, next) => {
    // Calculate CSS template filepath and if it exists, render it with CSS contentType, else proceed
    const cssFilepath = `css/${req.params.filename}.ejs`;
    if (fs.existsSync(path.join(themePath, cssFilepath))) {
      res.contentType("text/css");
      renderTemplate(req, res, cssFilepath);
    } else {
      next();
    }
  });

  // Mount route for 'When user requests a template, try to render it'
  app.get("/:slug", (req, res, next) => {
    // If template exists, render it, else proceed
    if (fs.existsSync(`${themePath}/${req.params.slug + ".ejs"}`)) {
      renderTemplate(req, res, req.params.slug);
    } else {
      next();
    }
  });

  // Mount route for 'When a user requests any file that doesn't exist, send bare 404'
  app.get(/\./, (req, res) => {
    res.sendStatus(404);
  });

  // Mount route for 'When a user requests any template that doesn't exist, render 404 template'
  app.get("*", (req, res) => {
    res.statusCode = 404;
    renderTemplate(req, res, "404");
  });
}

// Mount error handler
app.use(function (err, req, res, next) {
  req.log.error(err);
  res.statusCode = 500;
  res.end("Server Error");
});

// Launch app and display msg
app.listen(config.get("app.port"), () =>
  console.info(
    `Launched ${logConfig.name} serving ${servePath} on port ${config.get(
      "app.port",
    )} with log level ${logConfig.level}`,
  ),
);
