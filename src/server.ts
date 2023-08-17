import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { pgHelper } from './database';
import routesApp from './routes';

const app = express();

// config de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(routesApp);

pgHelper
	.connect()
	.then(() => {
		// executa aqui quando a conexão for estabelecida com o postgres
		app.listen(process.env.PORT, () => console.log(`Servidor rodando na porta ${process.env.PORT} 🚀`));
	})
	.catch((err) => {
		// executa aqui quando a conexão não for estabelecida por qualquer tipo de erro
		console.log(err);
	});
