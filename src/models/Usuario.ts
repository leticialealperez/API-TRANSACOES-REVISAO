import { Base } from './Base';

export type UsuarioJSON = {
	id: string;
	email: string;
};

export class Usuario extends Base {
	constructor(id: string, private _email: string, private _senha: string) {
		super(id);
	}

	public toJSON(): UsuarioJSON {
		return {
			id: this._id,
			email: this._email,
		};
	}
}

/*

*/
