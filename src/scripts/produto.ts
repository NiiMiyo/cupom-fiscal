export interface NegociacaoProps {
	valor: number;
	tipo: "porcentagem" | "fixo";
}

export class Produto {
	constructor(
		public codigo: number,
		public descricao: string,
		public unidade: string,
		public valorUnitario: number,
		public substituicaoTributaria: string,
		public negocio: NegociacaoProps = { valor: 1, tipo: "porcentagem" }
	) {
		if (negocio.tipo == "porcentagem") {
			this.valorUnitario *= negocio.valor;
		} else {
			this.valorUnitario += negocio.valor;
		}
	}
}
