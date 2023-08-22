import { pgHelper } from '../../database';
import { UsuarioEntity } from '../../database/entities/usuario.entity';
import { Usuario } from '../../models';
import { Endereco } from '../../models/Endereco';
import { CadastrarLogarUsuarioDTO } from '../../usecases';

export class UsuariosRepository {
	public async verificarSeExisteUsuarioPorEmail(email: string): Promise<boolean> {
		// const usuarioEncontrado = await UsuarioEntity.findOneBy({ email });
		const manager = pgHelper.client.manager;

		const usuarioEncontrado = await manager.findOne(UsuarioEntity, {
			where: { email },
			relations: {
				endereco: true,
			},
		});

		return !!usuarioEncontrado;
	}

	public async cadastrar(dados: CadastrarLogarUsuarioDTO): Promise<Usuario> {
		const { email, senha } = dados;

		const manager = pgHelper.client.manager;
		const newUser = manager.create(UsuarioEntity, { email, senha });
		const usuarioCriado = await manager.save(newUser);

		return this.entityToModel(usuarioCriado);
	}

	public async autenticacaoLogin(dados: CadastrarLogarUsuarioDTO): Promise<Usuario | undefined> {
		const { email, senha } = dados;
		const usuarioRepo = pgHelper.client.manager;
		const usuarioEncontrado = await usuarioRepo.findOne(UsuarioEntity, {
			where: { email, senha },
			relations: {
				endereco: true,
			},
		});

		if (!usuarioEncontrado) return undefined;

		return this.entityToModel(usuarioEncontrado);
	}

	public async buscaUsuarioPorID(idUsuario: string): Promise<Usuario | undefined> {
		const usuarioRepo = pgHelper.client.manager;
		const usuarioEncontrado = await usuarioRepo.findOne(UsuarioEntity, {
			where: {
				id: idUsuario,
			},
			relations: {
				endereco: true,
			},
		});

		// const usuarios = await usuarioRepo.find(UsuarioEntity, {
		// 	where: {
		// 		email: ILike('leticia'),
		// 	},
		// });

		if (!usuarioEncontrado) return undefined;

		return this.entityToModel(usuarioEncontrado);
	}

	// TRANSFORMA RESULTADO DA BUSCA EM UMA INSTANCIA DA MODEL
	private entityToModel(dadosDB: UsuarioEntity): Usuario {
		const { endereco } = dadosDB;

		if (endereco) {
			const enderecoModel = new Endereco(
				endereco.id,
				endereco.logradouro,
				endereco.cidade,
				endereco.uf,
				endereco.criadoEm,
				endereco.numero
			);

			return new Usuario(dadosDB.id, dadosDB.email, dadosDB.senha, enderecoModel);
		}

		return new Usuario(dadosDB.id, dadosDB.email, dadosDB.senha);
	}
}
