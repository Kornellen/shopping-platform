const { validationResult } = require("express-validator");

import { Response, Request, NextFunction } from "express";

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()[0].msg });
  }
  next();
};

export default validateRequest;
