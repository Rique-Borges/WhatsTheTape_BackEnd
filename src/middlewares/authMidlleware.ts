import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = "SUPERSECRET";
const prisma = new PrismaClient();

type AuthRequest = Request & { user?: User };

export async function authenticateToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers["authorization"];
    const jwtToken = authHeader?.split(" ")[1];
    if (!jwtToken) {
        return res.sendStatus(401);
    }

    try {
        // Valida o token JWT e define a carga útil esperada
        const payload = jwt.verify(jwtToken, JWT_SECRET) as { tokenId: number };

        // Busca o token no banco de dados
        const dbToken = await prisma.token.findUnique({
            where: { id: payload.tokenId },
            include: { user: true }
        });

        // Verifica se o token é válido e não expirou
        if (!dbToken?.valid || dbToken.expiration < new Date()) {
            return res.status(401).json({ error: "API token invalid or expired" });
        }

        // Se o token for válido, armazena o usuário no `req.user`
        req.user = dbToken.user;

    } catch (e) {
        return res.sendStatus(401); // Token inválido ou erro na verificação
    }

    next(); // Chama o próximo middleware ou a rota
}
