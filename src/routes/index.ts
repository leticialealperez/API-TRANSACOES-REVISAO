import express from 'express';
import { TransacaoController, UsuariosController } from '../controllers';
import {
	validarDadosUsuario,
	validarEnvioDadosTransacao,
	validarTipoTransacao,
	validarValorETipoTransacao,
} from '../middlewares';

const app = express.Router(); // essa linha adiciona
app.get('/', (req, res) => res.status(200).json({ message: 'OK' }));

// USUARIOS
app.post(
	'/usuarios/cadastro',
	validarDadosUsuario,
	UsuariosController.cadastrar
);
app.post('/usuarios/login', validarDadosUsuario, UsuariosController.logar);

// TRANSAÇÕES
app.post(
	'/usuarios/:idUsuario/transacoes',
	validarEnvioDadosTransacao,
	validarValorETipoTransacao,
	TransacaoController.cadastrar
);
app.get(
	'/usuarios/:idUsuario/transacoes',
	validarTipoTransacao,
	TransacaoController.listarTodas
);
app.get(
	'/usuarios/:idUsuario/transacoes/:idTransacao',
	TransacaoController.listarPorID
);
app.put(
	'/usuarios/:idUsuario/transacoes/:idTransacao',
	validarValorETipoTransacao,
	TransacaoController.atualizar
);
app.delete(
	'/usuarios/:idUsuario/transacoes/:idTransacao',
	TransacaoController.deletar
);

export default app; // essa linha adiciona
