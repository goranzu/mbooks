"use strict";

const { Router } = require("express");
const authControllers = require("./auth.controllers");

const authRouter = Router();

authRouter.post("/signup", authControllers.signup);

authRouter.post("/signin", authControllers.signin);

module.exports = authRouter;
