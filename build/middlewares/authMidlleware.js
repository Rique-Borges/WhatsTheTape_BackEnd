"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';
const prisma = new client_1.PrismaClient();
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers["authorization"];
        const jwtToken = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        if (!jwtToken) {
            return res.sendStatus(401);
        }
        try {
            // Valida o token JWT e define a carga útil esperada
            const payload = jsonwebtoken_1.default.verify(jwtToken, JWT_SECRET);
            // Busca o token no banco de dados
            const dbToken = yield prisma.token.findUnique({
                where: { id: payload.tokenId },
                include: { user: true }
            });
            // Verifica se o token é válido e não expirou
            if (!(dbToken === null || dbToken === void 0 ? void 0 : dbToken.valid) || dbToken.expiration < new Date()) {
                return res.status(401).json({ error: "API token invalid or expired" });
            }
            // Se o token for válido, armazena o usuário no `req.user`
            req.user = dbToken.user;
        }
        catch (e) {
            return res.sendStatus(401); // Token inválido ou erro na verificação
        }
        next(); // Chama o próximo middleware ou a rota
    });
}
