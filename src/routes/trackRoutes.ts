import { Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

//Crud da Track

// Criar Track
router.post('/', async (req,res)=>{
    const {content, image, userId} = req.body;

    try{
    const result = await prisma.track.create({
        data:{
           content ,
           image,
           userId
        }
    });
    res.json(result);
}catch(e){
        res.status(400).json({error:"Username or Email already in use"})
    }
});

//Listar Tracks
router.get('/', async(req,res)=>{
    const allTracks = await prisma.track.findMany();
    res.json(allTracks);
});

//mostrar 1 Track
router.get('/:id', async(req,res)=>{
    const {id} = req.params
    const track = await prisma.track.findUnique({where:{id:Number(id) } } );
    if (!track){
        return res.status(404).json({error:"Track not found!"})
    }
    res.json(track);
});

//Atualizar Track
router.put('/:id', (req,res)=>{
    const {id} = req.params;
    res.status(501).json({error: `not implemented ${id}`});
});

//deletar Track
router.delete('/:id', async (req,res)=>{
    const {id} = req.params;
    await prisma.track.delete({where:{id:Number(id)}});
    res.status(501).json({error: `not implemented ${id}`});
});

export default router;