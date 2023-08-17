import { pgHelper } from '../../database';
import { UsuarioJSON } from '../../models';
import { CadastrarLogarUsuarioDTO } from '../../usecases';

export class UsuariosRepository {
	public async verificarSeExisteUsuarioPorEmail(email: string): Promise<boolean> {
		const resultado = await pgHelper.client.query('SELECT * FROM usuarios WHERE email = $1', [email]);

		return resultado.length !== 0;
	}

	public async cadastrar(dados: CadastrarLogarUsuarioDTO): Promise<UsuarioJSON> {
		const { email, senha } = dados;
		await pgHelper.client.query('INSERT INTO usuarios (email, senha) VALUES ($1, $2)', [email, senha]);

		const resultadoSelect = await pgHelper.client.query('SELECT * from usuarios ORDER BY criadoEm DESC LIMIT 1');

		const [ultimoInserido] = resultadoSelect;

		return {
			id: ultimoInserido.id,
			senha: ultimoInserido.senha,
			email: ultimoInserido.email,
		};
	}

	public async autenticacaoLogin(dados: CadastrarLogarUsuarioDTO): Promise<UsuarioJSON | undefined> {
		const { email, senha } = dados;
		const resultado = await pgHelper.client.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [
			email,
			senha,
		]);

		if (!resultado.length) return undefined;

		const [registro] = resultado;

		return {
			id: registro.id,
			email: registro.email,
			senha: registro.senha,
		};
	}

	public async buscaUsuarioPorID(idUsuario: string): Promise<UsuarioJSON | undefined> {
		const resultado = await pgHelper.client.query('SELECT * from usuarios WHERE id = $1', [idUsuario]);

		if (!resultado.length) return undefined;

		return {
			id: resultado[0].id,
			email: resultado[0].email,
			senha: resultado[0].senha,
		};
	}
}
