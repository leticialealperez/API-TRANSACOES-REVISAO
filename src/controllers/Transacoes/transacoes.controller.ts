import { Request, Response } from 'express';
import { TipoTransacao } from '../../models';
import {
	AtualizarTransacao,
	CadastrarTransacao,
	DeletarTransacao,
	ListarPorID,
	ListarTransacoes,
} from '../../usecases';

export class TransacaoController {
	public static async cadastrar(req: Request, res: Response) {
		const { idUsuario } = req.params;
		const { valor, tipo } = req.body;

		// chamar as regras de negocio
		const usecase = new CadastrarTransacao();
		const resultado = await usecase.execute({ idUsuario, tipo, valor });

		if (!resultado.sucesso) {
			return res.status(401).json(resultado);
		}

		return res.status(200).json(resultado);
	}

	public static listarTodas(req: Request, res: Response) {
		const { tipo } = req.query;
		const { idUsuario } = req.params;

		// regra de negocio
		const usecase = new ListarTransacoes();
		const resultado = usecase.execute({
			idUsuario,
			tipo: tipo as TipoTransacao | undefined,
		});

		if (!resultado.sucesso) {
			return res.status(401).json(resultado);
		}

		return res.status(200).json(resultado);
	}

	public static listarPorID(req: Request, res: Response) {
		const { idUsuario, idTransacao } = req.params;

		// regra de negocio
		const usecase = new ListarPorID();
		const resultado = usecase.execute({
			idUsuario,
			idTransacao,
		});

		if (!resultado.sucesso) {
			return res.status(404).json(resultado);
		}

		return res.status(200).json(resultado);
	}

	public static atualizar(req: Request, res: Response) {
		const { idUsuario, idTransacao } = req.params;
		const { tipo, valor } = req.body;

		// regra de negocio
		const usecase = new AtualizarTransacao();
		const resultado = usecase.execute({
			idUsuario,
			idTransacao,
			novosDados: { tipo, valor },
		});

		if (!resultado.sucesso) {
			return res.status(404).json(resultado);
		}

		return res.status(200).json(resultado);
	}

	public static deletar(req: Request, res: Response) {
		const { idUsuario, idTransacao } = req.params;

		// regra de negocio
		const usecase = new DeletarTransacao();
		const resultado = usecase.execute({
			idUsuario,
			idTransacao,
		});

		if (!resultado.sucesso) {
			return res.status(404).json(resultado);
		}

		return res.status(200).json(resultado);
	}
}
