import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 48;
const JWT_SECRET = "SUPERSECRET";

const router = Router();
const prisma = new PrismaClient();

//gerar um número de 8 dígitos aleatório como o token de email
function generateEmailToken():string{
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
function generateAuthToken(tokenId:number):string{
    const jwtPayload = {tokenId};

        return jwt.sign(jwtPayload, JWT_SECRET,{
            algorithm:"HS256",
            noTimestamp:true
        })
    }


//Criar usuário se não existir
// gerar um emailToken e enviar para o email
router.post('/login', async (req, res)=> {
    const {email} = req.body;

    //gerar token
    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60000)

    try{const createdToken = await prisma.token.create({
        data:{
            type: 'EMAIL',
            emailToken,
            expiration,
            user: {
                connectOrCreate: {
                    where:{email},
                    create :{email}
                },
            },
        },
    });
    console.log(createdToken);

    res.sendStatus(200);} catch(e){
        console.log(e);
        res.status(400).json({error: "couldn't start authentication process"})
    }
    
});

//Validar o emailToken
//Gerar um token JWT

router.post('/authenticate', async (req, res) => {
    const { email, emailToken } = req.body;

    try {
        // Find the token and include the associated user
        const dbEmailToken = await prisma.token.findFirst({
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

        const apiToken = await prisma.token.create({
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
        await prisma.token.update({
            where: { id: dbEmailToken.id },
            data: { valid: false },
        });

        // Generate JWT
        const authToken = generateAuthToken(apiToken.id);

        res.json({ authToken });
    } catch (error) {
        console.error("Authentication failed:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;