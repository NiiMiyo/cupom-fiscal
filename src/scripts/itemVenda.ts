import { Produto } from "./produto";

export class ItemVenda {
	constructor(
		public item: number,
		public produto: Produto,
		public quantidade: number
	) {}

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
