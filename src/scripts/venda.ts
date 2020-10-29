import { justify } from "./actions";
import { ItemVenda } from "./itemVenda";
import { Loja } from "./loja";

export class Venda {
	constructor(
		public loja: Loja,
		public readonly dataHora: Date,
		public readonly ccf: number,
		public readonly coo: number
	) {
		this.ccf = Math.floor(ccf);
		this.coo = Math.floor(coo);

		this._itens = new Array<ItemVenda>();
		this._finalizada = false;
		this._troco = NaN;
	}

	private _troco: number;
	public get troco(): number {
		if (!this._finalizada) {
			throw new Error("A venda não foi finalizada.");
		}

		return this._troco;
	}

	private _finalizada: boolean;
	public get finalizada(): boolean {
		return this._finalizada;
	}

	private _itens: ItemVenda[];
	public get itens(): ItemVenda[] {
		return this._itens;
	}

	public dadosVendas(): string {
		this.validarCamposObrigatorios();

		const dia = justify(
			this.dataHora.getDate().toString(),
			2,
			"0",
			"right"
		);

		const mes = justify(
			this.dataHora.getMonth().toString(),
			2,
			"0",
			"right"
		);

		const hora = justify(
			this.dataHora.getHours().toString(),
			2,
			"0",
			"right"
		);

		const minuto = justify(
			this.dataHora.getMinutes().toString(),
			2,
			"0",
			"right"
		);

		const segundos = justify(
			this.dataHora.getSeconds().toString(),
			2,
			"0",
			"right"
		);

		let textoData = `${dia}/${mes}/${this.dataHora.getFullYear()}`;
		let textoHora = `${hora}:${minuto}:${segundos}`;

		return `${textoData} ${textoHora}V CCF:${justify(
			this.ccf.toString(),
			6,
			"0",
			"right"
		)} COO: ${justify(this.coo.toString(), 6, "0", "right")}`;
	}

	public imprimeCupom(): string {
		this.validarCamposObrigatorios();

		let cupom: string;

		let textoLoja = this.loja.dadosLoja();
		let textoVenda = this.dadosVendas();

		cupom = `${textoLoja}------------------------------\n${textoVenda}\n   CUPOM FISCAL   \nITEM CODIGO DESCRICAO QTD UN VL UNIT(R$) ST VL ITEM(R$)\n`;

		this._itens.forEach((item) => {
			cupom += item.imprimeItem() + "\n";
		});

		cupom += `------------------------------\n`;
		cupom += `TOTAL R\$ ${this.valorTotal().toFixed(2)}\n`;

		return cupom;
	}

	public adicionarItem(item: ItemVenda) {
		if (this.finalizada) {
			throw new Error("Esta venda já foi finalizada.");
		}

		// Item de Venda com quantidade zero ou negativa - não pode ser adicionado na venda
		if (item.quantidade <= 0) {
			throw new Error("Quantidade inválida.");
		}

		// Produto com valor unitário zero ou negativo - item não pode ser adicionado na venda com produto nesse estado
		if (item.produto.valorUnitario <= 0) {
			throw new Error("Valor unitário inválido.");
		}

		// Dois itens que apontam pro mesmo produto
		this.itens.forEach((item_linha) => {
			if (item.produto.codigo == item_linha.produto.codigo) {
				throw new Error("Produto já adicionado na venda.");
			}
		});

		this._itens.push(item);
	}

	private validarCamposObrigatorios() {
		this.loja.dadosLoja();

		if (this.ccf <= 0) {
			throw new Error("O Contador de Cupom Fiscal (CCF) é obrigatório.");
		}

		if (this.coo <= 0) {
			throw new Error("O Contador de Cupom Fiscal (COO) é obrigatório.");
		}

		if (this.itens.length == 0) {
			throw new Error(`É necessário pelo menos um item na venda.`);
		}
	}

	public valorTotal(): number {
		const itemsTotal = this._itens.map((item) => {
			return item.valorTotal();
		});
		let total = 0;
		itemsTotal.forEach((value) => {
			total += value;
		});

		return total;
	}

	public finalizarVenda(
		pagamento: "dinheiro" | "credito" | "debito",
		valor: number
	): number {
		if (valor < this.valorTotal()) {
			throw new Error("O valor pago não é suficente.");
		}
		this._troco = valor - this.valorTotal();
		this._finalizada = true;

		return this._troco;
	}
}
