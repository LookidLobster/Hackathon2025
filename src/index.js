import express from 'express';
import multer from 'multer';
import { readFile } from 'node:fs/promises'
import { googleAI } from '@genkit-ai/googleai'
import { genkit } from 'genkit'
import { url } from 'node:inspector';
import { text } from 'node:stream/consumers';
import { PictureSchema } from './object_schema.js';

const app = express();
const port = 3000;
const upload = multer({ dest: "/tmp"})

export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', {
    temperature: 0.2
  })
})

app.use('/', express.static('client/dist'))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const data = await readFile(req.file.path, {encoding: 'base64'} )
    const response = await ai.generate({
      prompt: [
        { media: {url: `data:image/jpeg;base64,${data}`} },
        { text: 'Analyze the image, and return a JSON description based on the given schema' }
      ],
      output: { schema: PictureSchema },
    })

    if (response.output) {
      res.send(response.output)
    } else {
      const j = { message: response.text }
      res.send(j)
    }    
  } catch (err) {
    res.send(err.message, 500)
  }
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
