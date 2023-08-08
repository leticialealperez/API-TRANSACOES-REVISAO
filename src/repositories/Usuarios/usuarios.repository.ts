import { usuarios } from '../../database';
import { Usuario } from '../../models';
import { CadastrarLogarUsuarioDTO } from '../../usecases';

export class UsuariosRepository {
	public verificarSeExisteUsuarioPorEmail(email: string): boolean {
		// se existir - true
		// se nao existir - false
		return usuarios.some((usuario) => usuario.toJSON().email === email);
	}

	public cadastrar(dados: CadastrarLogarUsuarioDTO): Usuario {
		const novoUsuario = new Usuario(dados.email, dados.senha);

		usuarios.push(novoUsuario);
		return novoUsuario;
	}

	public autenticacaoLogin(
		dados: CadastrarLogarUsuarioDTO
	): Usuario | undefined {
		return usuarios.find((usuario) => {
			const user = usuario.toJSON();

			return user.email === dados.email && user.senha === dados.senha;
		});
	}

	public buscaUsuarioPorID(idUsuario: string): Usuario | undefined {
		return usuarios.find((usuario) => usuario.toJSON().id === idUsuario);
	}
}
