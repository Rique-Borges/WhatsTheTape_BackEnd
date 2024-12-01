import express from "express";
import userRoutes from "./routes/userRoutes";
import trackRoutes from "./routes/trackRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticateToken } from "./middlewares/authMidlleware";

const app = express();
app.use(express.json());

// As rotas /user e /track requerem autenticação
app.use("/user", authenticateToken, userRoutes);
app.use("/track", authenticateToken, trackRoutes);

// A rota /auth não requer autenticação
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
