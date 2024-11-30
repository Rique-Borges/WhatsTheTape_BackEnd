import { Router } from "express";

const router = Router();

//Crud da Track

// Criar Track
router.post('/', (req,res)=>{
    res.status(501).json({error: 'not implemented'});
});

//Listar Tracks
router.get('/', (req,res)=>{
    res.status(501).json({error: 'not implemented'});
});

//mostrar 1 Track
router.get('/:id', (req,res)=>{
    const {id} = req.params;
    res.status(501).json({error: `not implemented ${id}`});
});

//Atualizar Track
router.put('/:id', (req,res)=>{
    const {id} = req.params;
    res.status(501).json({error: `not implemented ${id}`});
});

//deletar Track
router.delete('/:id', (req,res)=>{
    const {id} = req.params;
    res.status(501).json({error: `not implemented ${id}`});
});

export default router;