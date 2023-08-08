import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import routesApp from './routes';

const app = express();

// config de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(routesApp);

app.listen(process.env.PORT, () =>
	console.log(`Servidor rodando na porta ${process.env.PORT} 🚀`)
);
