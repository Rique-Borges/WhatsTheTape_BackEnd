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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
//Crud da Track
/// Criar Track
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, image } = req.body;
    // @ts-ignore
    const user = req.user;
    try {
        const result = yield prisma.track.create({
            data: {
                content,
                image,
                userId: user.id,
            },
            include: { user: true },
        });
        res.json(result); // Resposta final enviada aqui
    }
    catch (e) {
        res.status(400).json({ error: "Username or Email already in use" });
    }
}));
//Listar Tracks
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allTracks = yield prisma.track.findMany({
        include: { user: { select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                } } },
    });
    res.json(allTracks);
}));
//mostrar 1 Track
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const track = yield prisma.track.findUnique({
        where: { id: Number(id) },
        include: { user: true }
    });
    if (!track) {
        return res.status(404).json({ error: "Track not found!" });
    }
    res.json(track);
}));
//deletar Track
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.track.delete({ where: { id: Number(id) } });
    res.status(501).json({ error: `not implemented ${id}` });
}));
exports.default = router;
