import { UsuarioJSON } from '../../models';
import { UsuariosRepository } from '../../repositories';

export type CadastrarLogarUsuarioDTO = {
	email: string;
	senha: string;
};

export type RetornoCadastroLoginUsuario = {
	sucesso: boolean;
	mensagem: string;
	dados?: Omit<UsuarioJSON, 'senha'>;
};

export class CadastrarUsuario {
	public async execute(dadosNovoUsuario: CadastrarLogarUsuarioDTO): Promise<RetornoCadastroLoginUsuario> {
		const repository = new UsuariosRepository();

		// 1 - olhar para a lista de usuarios e verifica se existe um outro usuario com o mesmo email já cadastrado
		const existe = await repository.verificarSeExisteUsuarioPorEmail(dadosNovoUsuario.email);
		if (existe) {
			return {
				sucesso: false,
				mensagem: 'Já existe um usuário cadastrado com esse e-mail.',
			};
		}

		// 2 - criar o novo usuario
		// 3 - inserir o novo usuario na lista de usuarios
		const novoUsuarioCadastrado = await repository.cadastrar(dadosNovoUsuario);

		return {
			sucesso: true,
			mensagem: 'Usuário cadastrado com sucesso!',
			dados: novoUsuarioCadastrado,
		};
	}
}
