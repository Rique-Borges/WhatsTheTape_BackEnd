import { Router } from "express";

const router = Router();

//Crud do usuario

// Criar usuarios
router.post('/', (req,res)=>{
    res.status(501).json({error: 'not implemented'});
});

//Listar usuarios
router.get('/', (req,res)=>{
    res.status(501).json({error: 'not implemented'});
});

//mostrar 1 usuario
router.get('/:id', (req,res)=>{
    const {id} = req.params;
    res.status(501).json({error: `not implemented ${id}`});
});

//Atualizar usuario
router.put('/:id', (req,res)=>{
    const {id} = req.params;
    res.status(501).json({error: `not implemented ${id}`});
});

//deletar usuario
router.delete('/:id', (req,res)=>{
    const {id} = req.params;
    res.status(501).json({error: `not implemented ${id}`});
});

export default router;