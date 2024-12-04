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
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailService_1 = require("../services/emailService");
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 48;
const JWT_SECRET = process.env.JWT_SECRET || 'SUPERSECRET';
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
//gerar um número de 8 dígitos aleatório como o token de email
function generateEmailToken() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
function generateAuthToken(tokenId) {
    const jwtPayload = { tokenId };
    return jsonwebtoken_1.default.sign(jwtPayload, JWT_SECRET, {
        algorithm: "HS256",
        noTimestamp: true
    });
}
//Criar usuário se não existir
// gerar um emailToken e enviar para o email
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    //gerar token
    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60000);
    try {
        const createdToken = yield prisma.token.create({
            data: {
                type: 'EMAIL',
                emailToken,
                expiration,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: { email }
                    },
                },
            },
        });
        console.log(createdToken);
        yield (0, emailService_1.sendEmailToken)(email, emailToken);
        res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ error: "couldn't start authentication process" });
    }
}));
//Validar o emailToken
//Gerar um token JWT
router.post('/authenticate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, emailToken } = req.body;
    try {
        // Find the token and include the associated user
        const dbEmailToken = yield prisma.token.findFirst({
            where: {
                emailToken,
                type: "EMAIL",
                valid: true, // Ensure it's valid
                expiration: {
                    gt: new Date() // Ensure it's not expired
                },
            },
            include: { user: true },
        });
        // If the token does not exist or the email doesn't match, return 401
        if (!dbEmailToken || dbEmailToken.user.email !== email) {
            console.error("Invalid token or email mismatch");
            return res.sendStatus(401);
        }
        // Generate a new API token with an expiration
        const expiration = new Date(new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60000);
        const apiToken = yield prisma.token.create({
            data: {
                type: "API",
                expiration,
                user: {
                    connect: {
                        email,
                    },
                },
            },
        });
        // Invalidate the email token
        yield prisma.token.update({
            where: { id: dbEmailToken.id },
            data: { valid: false },
        });
        // Generate JWT
        const authToken = generateAuthToken(apiToken.id);
        res.json({ authToken });
    }
    catch (error) {
        console.error("Authentication failed:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
