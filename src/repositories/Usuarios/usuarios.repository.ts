import { pgHelper } from '../../database';
import { Usuario, UsuarioJSON } from '../../models';
import { CadastrarLogarUsuarioDTO } from '../../usecases';

export class UsuariosRepository {
	public async verificarSeExisteUsuarioPorEmail(email: string): Promise<boolean> {
		const [usuarioEncontrado] = await pgHelper.client.query('SELECT * FROM usuarios WHERE email = $1', [email]);

		return !!usuarioEncontrado;
	}

	public async cadastrar(dados: CadastrarLogarUsuarioDTO): Promise<Usuario> {
		const { email, senha } = dados;
		await pgHelper.client.query('INSERT INTO usuarios (email, senha) VALUES ($1, $2)', [email, senha]);

		const [ultimoInserido] = await pgHelper.client.query('SELECT * from usuarios ORDER BY criadoEm DESC LIMIT 1');

		return this.entityToModel(ultimoInserido);
	}

	public async autenticacaoLogin(dados: CadastrarLogarUsuarioDTO): Promise<Usuario | undefined> {
		const { email, senha } = dados;
		const [usuarioEncontrado] = await pgHelper.client.query(
			'SELECT * FROM usuarios WHERE email = $1 AND senha = $2',
			[email, senha]
		);

		if (!usuarioEncontrado) return undefined;

		return this.entityToModel(usuarioEncontrado);
	}

	public async buscaUsuarioPorID(idUsuario: string): Promise<Usuario | undefined> {
		const [usuarioEncontrado] = await pgHelper.client.query('SELECT * from usuarios WHERE id = $1', [idUsuario]);

		if (!usuarioEncontrado) return undefined;

		return this.entityToModel(usuarioEncontrado);
	}

	// TRANSFORMA RESULTADO DA BUSCA EM UMA INSTANCIA DA MODEL
	private entityToModel(dadosDB: UsuarioJSON & { senha: string }): Usuario {
		return new Usuario(dadosDB.id, dadosDB.email, dadosDB.senha);
	}
}
