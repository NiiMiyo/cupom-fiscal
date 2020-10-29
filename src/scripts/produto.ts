export class Produto {
	constructor(
		public codigo: number,
		public descricao: string,
		public unidade: string,
		public valorUnitario: number,
		public substituicaoTributaria: string
	) {}
}
