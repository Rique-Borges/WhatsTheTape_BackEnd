import express from 'express';
import userRoutes from './routes/userRoutes'
import trackRoutes from './routes/trackRoutes'

const app = express();
app.use(express.json());
app.use('/user',userRoutes);
app.use('/track',trackRoutes);

app.get('/', (req, res)=>{
    res.send('helloworld ');
});

app.listen(3000, ()=>{
    console.log("server ready at localhost:3000");
});