"use strict";

const { Router } = require("express");
const controllers = require("./controllers");

const authRouter = Router();

authRouter.post("/signup", controllers.signup);

authRouter.post("/signin", controllers.signin);

module.exports = authRouter;
