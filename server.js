const config = require("config");
const ejs = require("ejs");
const express = require("express");
const fs = require("fs");
const path = require("path");
const os = require("os");

const logConfig = {
  level: process.env.LOG_LEVEL || "error",
  name: config.get("app.name"),
};

// Instantiate Express app
const app = express();

// If Prod, configure static server
if (process.env.NODE_ENV === "production") {
  app.use(express.static(config.get("app.staticFolder")));
}
// Else configure SSR server
else {
  // Calculate theme folder
  const theme = process.env.THEME || config.get("app.defaultTheme");
  const themePath = path.join(config.get("app.themesFolder"), theme);

  // Setup template engine
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, themePath));

  // Load theme config and build locals object, then define locals helper
  const themeConfig = JSON.parse(fs.readFileSync(`${themePath}/theme.json`));

  const buildLocals = (req) => {
    // If ?flavor param and flavor config exists, load it and merge it into locals, else return locals unchanged
    if (
      req.query.flavor &&
      fs.existsSync(
        `${themePath}/flavor-${req.query.flavor.toLowerCase()}.json`,
      )
    ) {
      const flavorConfig = JSON.parse(
        fs.readFileSync(
          `${themePath}/flavor-${req.query.flavor.toLowerCase()}.json`,
        ),
      );
      const locals = Object.assign({}, { req }, themeConfig, flavorConfig);
      return locals;
    }
    return Object.assign({}, { req }, themeConfig);
  };

  const renderTemplate = (req, res, template_slug) => {
    res.render(template_slug, buildLocals(req));
  };

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

  // Mount route for health check
  app.get("/health-check", (req, res) => {
    const locals = buildLocals(req);
    const [one, five, fifteen] = os.loadavg();
    res.status(404);
    res.send({
      app: {
        environment: process.env["NODE_ENV"],
        logLevel: logConfig.level,
        name: logConfig.name,
        theme,
        themeConfig,
        themePath,
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
    });
  });

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
    if (fs.existsSync(`src/${req.params.slug + ".ejs"}`)) {
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

// Launch app and display msg
app.listen(config.get("app.port"), () =>
  console.info(`Server running on port ${config.get("app.port")}`),
);
