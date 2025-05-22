const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient();


module.exports = router;
