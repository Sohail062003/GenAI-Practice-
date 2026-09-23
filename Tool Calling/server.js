import express from 'express';
import cors from 'cors'
import { generate } from './chatBot.js';

const app = express();

const port = 3001;

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('hello world');  
});

app.post('/chat', async (req, res) => {
    const {message, threadId} = req.body;

    if (!message || !threadId) {
        return res.status(400).json({message: 'All Field are requierd' })
    }

    const result = await generate(message, threadId);
    
    console.log('result: ', result);

    res.json({ message: result });
})

app.listen(port, () => {
    console.log(`Server is running on Port ${port}`)
});