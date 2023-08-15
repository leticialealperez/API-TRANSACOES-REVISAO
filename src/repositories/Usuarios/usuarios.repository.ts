import { Database } from '../../database';
import { UsuarioJSON } from '../../models';
import { CadastrarLogarUsuarioDTO } from '../../usecases';

export class UsuariosRepository {
	public async verificarSeExisteUsuarioPorEmail(email: string): Promise<boolean> {
		const resultado = await Database.query('SELECT * FROM usuarios WHERE email = $1', [email]);

		// !!0, !!undefined, !!null ou !!"" => false
		// true
		return !!resultado.rowCount;
	}

	public async cadastrar(dados: CadastrarLogarUsuarioDTO): Promise<UsuarioJSON> {
		const { email, senha } = dados;
		const resultadoInsert = await Database.query('INSERT INTO usuarios (email, senha) VALUES ($1, $2)', [
			email,
			senha,
		]);
		const resultadoSelect = await Database.query('SELECT * from usuarios ORDER BY criadoEm DESC LIMIT 1');

		const [ultimoInserido] = resultadoSelect.rows;

		return {
			id: ultimoInserido.id,
			senha: ultimoInserido.senha,
			email: ultimoInserido.email,
		};
	}

	public async autenticacaoLogin(dados: CadastrarLogarUsuarioDTO): Promise<UsuarioJSON | undefined> {
		const { email, senha } = dados;
		const resultado = await Database.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [
			email,
			senha,
		]);

		if (!resultado.rowCount) return undefined;

		return {
			id: resultado.rows[0].id,
			email: resultado.rows[0].email,
			senha: resultado.rows[0].senha,
		};
	}

	public async buscaUsuarioPorID(idUsuario: string): Promise<UsuarioJSON | undefined> {
		const resultado = await Database.query('SELECT * from usuarios WHERE id = $1', [idUsuario]);

		if (!resultado.rowCount) return undefined;

		return {
			id: resultado.rows[0].id,
			email: resultado.rows[0].email,
			senha: resultado.rows[0].senha,
		};
	}
}
