import { Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import  jwt  from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

//Crud da Track

/// Criar Track
router.post('/', async (req, res) => {
    const { content, image } = req.body;
    // @ts-ignore
    const user = req.user;

    try {
        const result = await prisma.track.create({
            data: {
                content,
                image,
                userId: user.id,
            },
            include:{user:true},
        });
        res.json(result); // Resposta final enviada aqui
    } catch (e) {
        res.status(400).json({ error: "Username or Email already in use" });
    }
});



//Listar Tracks
router.get('/', async(req,res)=>{
    const allTracks = await prisma.track.findMany({
        include: {user:{select:{
            id:true,
            name:true,
            username:true,
            image:true}}},
    });
    res.json(allTracks);
});

//mostrar 1 Track
router.get('/:id', async(req,res) => {
    const {id} = req.params
    const track = await prisma.track.findUnique({
        where:{id:Number(id) },
        include: {user:true}
    } );
    if (!track){
        return res.status(404).json({error:"Track not found!"})
    }
    res.json(track);
});

//deletar Track
router.delete('/:id', async (req,res)=>{
    const {id} = req.params;
    await prisma.track.delete({where:{id:Number(id)}});
    res.status(501).json({error: `not implemented ${id}`});
});

export default router;