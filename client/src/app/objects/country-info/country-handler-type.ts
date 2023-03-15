import { SpainHandler } from './spain-handler';
import { PortugalHandler } from './portugal-handler';
import { CountryHandler } from './country-handler';

export class CountryHandlerType {

	private static all: { [name: string]: CountryHandlerType } = {};

	static readonly SPAIN = new CountryHandlerType('es', new SpainHandler());
	static readonly CATALONIA = new CountryHandlerType('ca', new SpainHandler());
	static readonly PORTUGAL = new CountryHandlerType('pt', new PortugalHandler());

	id: string;
	handler: CountryHandler;

	constructor(id: string, handler: CountryHandler) {
		this.id = id;
		this.handler = handler;
		CountryHandlerType.all[id] = this;
	}

	static parse(id: string): CountryHandlerType {
		return CountryHandlerType.all[id];
	}

}
