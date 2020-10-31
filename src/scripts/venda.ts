import { isEmpty, justify } from "./actions";
import { ImpressoraFiscal } from "./impressoraFiscal";
import { ItemVenda } from "./itemVenda";
import { Loja } from "./loja";

const IMPOSTO_FEDERAL = 0.0754;
const IMPOSTO_ESTADUAL = 0.0481;
const DIVISOR = "------------------------------\n";

interface ImpostoProps {
	federal: number;
	estadual: number;
}

export interface PagamentoProps {
	forma: "dinheiro" | "credito" | "debito";
	valor: number;
}

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
		this._operador = NaN;

		this._pagamento = {
			forma: "dinheiro",
			valor: NaN,
		};

		this._impressora = new ImpressoraFiscal("", "", "", "");
	}

	private _pagamento: PagamentoProps;
	public get pagamento(): PagamentoProps {
		if (!this._finalizada) {
			throw new Error("A venda não foi finalizada.");
		}

		return this._pagamento;
	}

	private _troco: number;
	public get troco(): number {
		if (!this._finalizada) {
			throw new Error("A venda não foi finalizada.");
		}

		return this._troco;
	}

	private _operador: number;
	public get operador(): number {
		if (!this._finalizada) {
			throw new Error("A venda não foi finalizada.");
		}
		return this._operador;
	}

	private _finalizada: boolean;
	public get finalizada(): boolean {
		return this._finalizada;
	}

	private _impressora: ImpressoraFiscal;
	public get impressora(): ImpressoraFiscal {
		if (!this._finalizada) {
			throw new Error("A venda não foi finalizada.");
		}
		return this._impressora;
	}

	private _itens: ItemVenda[];
	public get itens(): ItemVenda[] {
		return this._itens;
	}

	public get impostos(): ImpostoProps {
		return {
			estadual: this.valorTotal() * IMPOSTO_ESTADUAL,
			federal: this.valorTotal() * IMPOSTO_FEDERAL,
		};
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

		if (!this._finalizada) {
			throw new Error("A venda não foi finalizada.");
		}

		let cupom: string;

		let textoLoja = this.loja.dadosLoja();
		let textoVenda = this.dadosVendas();

		cupom = `${textoLoja}${DIVISOR}${textoVenda}\n   CUPOM FISCAL   \nITEM CODIGO DESCRICAO QTD UN VL UNIT(R$) ST VL ITEM(R$)\n`;

		this._itens.forEach((item, index) => {
			cupom += item.imprimeItem(index + 1) + "\n";
		});

		cupom += `${DIVISOR}`;

		const total = this.valorTotal().toFixed(2);
		const valorPago = this._pagamento.valor.toFixed(2);
		const troco = this.troco.toFixed(2);

		const impostoF = `${this.impostos.federal.toFixed(2)} (${(
			IMPOSTO_FEDERAL * 100
		).toFixed(2)})`;

		const impostoE = `${this.impostos.estadual.toFixed(2)} (${(
			IMPOSTO_ESTADUAL * 100
		).toFixed(2)}%)`;

		let formaDePagamento: string;

		switch (this._pagamento.forma) {
			case "credito":
				formaDePagamento = "Crédito";
				break;
			case "debito":
				formaDePagamento = "Débito";
				break;
			case "dinheiro":
				formaDePagamento = "Dinheiro";
				break;
		}

		cupom += `TOTAL R\$ ${total}\n${formaDePagamento} ${valorPago}\nTroco R$ ${troco}\nLei 12.741, Valor aprox., Imposto F=${impostoF}, E=${impostoE}\n`;

		cupom += `${DIVISOR}OPERADOR: ${
			this.operador
		}\n${DIVISOR}${this.impressora.dadosImpressora()}\n`;

		return cupom;
	}

	public adicionarItem(item: ItemVenda): void {
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

		if (isEmpty(item.produto.descricao)) {
			throw new Error("A descrição do item não pode ser vazia.");
		}

		// Dois itens que apontam pro mesmo produto
		this.itens.forEach((item_linha) => {
			if (item.produto.codigo == item_linha.produto.codigo) {
				throw new Error("Produto já adicionado na venda.");
			}
		});

		this._itens.push(item);
	}

	private validarCamposObrigatorios(): void {
		this.loja.dadosLoja();

		if (this.ccf <= 0) {
			throw new Error("O Contador de Cupom Fiscal (CCF) é obrigatório.");
		}

		if (this.coo <= 0) {
			throw new Error(
				"O Contador de Ordem de Operação (COO) é obrigatório."
			);
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
		forma: "dinheiro" | "credito" | "debito",
		valor: number,
		impressora: ImpressoraFiscal,
		operador: number
	): void {
		if (valor < this.valorTotal()) {
			throw new Error("O valor pago não é suficente.");
		}

		if (operador <= 0) {
			throw new Error("Operador inválido.");
		}

		impressora.validarImpressora();

		this._troco = valor - this.valorTotal();
		this._finalizada = true;
		this._impressora = impressora;
		this._operador = operador;
		this._pagamento = {
			forma,
			valor,
		};
	}
}
