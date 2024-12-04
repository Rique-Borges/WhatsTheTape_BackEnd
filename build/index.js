"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const trackRoutes_1 = __importDefault(require("./routes/trackRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMidlleware_1 = require("./middlewares/authMidlleware");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// As rotas /user e /track requerem autenticação
app.use("/user", authMidlleware_1.authenticateToken, userRoutes_1.default);
app.use("/track", authMidlleware_1.authenticateToken, trackRoutes_1.default);
// A rota /auth não requer autenticação
app.use("/auth", authRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
