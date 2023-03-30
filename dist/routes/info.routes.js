"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const config_1 = __importDefault(require("../config"));
const os_1 = __importDefault(require("os"));
const numCPUs = os_1.default.cpus().length;
const info = {
    args: config_1.default.ARGS,
    platform: process.platform,
    nodeversion: process.version,
    memory: JSON.stringify(process.memoryUsage().rss),
    execPath: config_1.default.ARGV._[0],
    proyectPath: process.cwd(),
    pid: process.pid,
    numCPUs,
};
const router = (0, express_1.Router)();
// Incorporación del endpoint /info para mostrar datos de variable global 'process'
router.get('/', (req, res) => {
    res.render('info', { info });
});
exports.default = router;
