import { Produto } from "./produto";

interface NegociacaoProps {
	valor: number;
	tipo: "porcentagem" | "fixo";
}

export class ItemVenda {
	constructor(
		public item: number,
		public produto: Produto,
		public quantidade: number,
		public negocio: NegociacaoProps = { valor: 1, tipo: "porcentagem" }
	) {
		switch (negocio.tipo) {
			case "fixo":
				this.produto.valorUnitario += this.negocio.valor;
				break;

			case "porcentagem":
				this.produto.valorUnitario *= this.negocio.valor;
				break;
		}
	}

	public imprimeItem(): string {
		return `${this.item} ${this.produto.codigo} ${this.produto.descricao} ${
			this.quantidade
		} ${this.produto.unidade} ${this.produto.valorUnitario.toFixed(2)} ${
			this.produto.substituicaoTributaria
		} ${this.valorTotal().toFixed(2)}`;
	}

	public valorTotal(): number {
		return this.quantidade * this.produto.valorUnitario;
	}
}
