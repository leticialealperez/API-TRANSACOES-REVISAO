import { randomUUID } from 'crypto';

export abstract class Base {
	protected _id: string;

	constructor() {
		this._id = randomUUID();
	}

	public toJSON() {
		// a lógica de execução vai ficar nas subclasses
	}
}
