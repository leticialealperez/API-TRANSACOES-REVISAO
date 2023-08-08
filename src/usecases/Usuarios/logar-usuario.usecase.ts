import { CadastrarLogarUsuarioDTO, RetornoCadastroLoginUsuario } from '..';
import { UsuariosRepository } from '../../repositories';

export class LogarUsuario {
	public execute(
		dadosUsuario: CadastrarLogarUsuarioDTO
	): RetornoCadastroLoginUsuario {
		// 1 - email e senha devem corresponder a um registro dentro da lista de usuarios
		const repository = new UsuariosRepository();
		const usuarioEncontrado = repository.autenticacaoLogin(dadosUsuario);

		if (!usuarioEncontrado) {
			return {
				sucesso: false,
				mensagem: 'Usuário não autorizado.',
			};
		}

		const usuario = usuarioEncontrado.toJSON();

		return {
			sucesso: true,
			mensagem: 'Usuário autorizado.',
			dados: {
				id: usuario.id,
				email: usuario.email,
			},
		};
	}
}
