export class ItemVenda {
	constructor(
		public item: number,
		public codigo: number,
		public descricao: string,
		public quantidade: number,
		public unidade: string,
		public valorUnitario: number,
		public substituicaoTributaria: string
	) {}

	public imprimeItem(): string {
		return `${this.item} ${this.codigo} ${this.descricao} ${
			this.quantidade
		} ${this.unidade} ${this.valorUnitario.toFixed(2)} ${
			this.substituicaoTributaria
		} ${this.valorTotal().toFixed(2)}`;
	}

	public valorTotal(): number {
		return this.quantidade * this.valorUnitario;
	}
}
