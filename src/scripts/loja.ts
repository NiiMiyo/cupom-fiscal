import { isEmpty } from "./actions";
import { Endereco } from "./endereco";
import { Venda } from "./venda";

export class Loja {
	constructor(
		public nomeLoja: string,
		public endereco: Endereco,
		public telefone: string,
		public observacao: string,
		public cnpj: string,
		public inscricaoEstadual: string
	) {}

	public readonly vendas = new Array<Venda>();

	public dadosLoja(): string {
		// Implemente aqui
		this.validarCamposObrigatorios();

		let loja = `${this.nomeLoja}\n`;
		loja += this.endereco.dadosEndereco();

		const telefone = !isEmpty(this.telefone) ? `Tel ${this.telefone}` : "";
		const temCep = !isEmpty(this.endereco.cep);

		let CepTelefone = "";

		if (temCep && telefone) {
			CepTelefone += ` `;
		}
		CepTelefone += `${telefone}\n`;

		loja += CepTelefone;

		const observacao = !isEmpty(this.observacao) ? this.observacao : "";
		loja += `${observacao}\n`;

		loja += `CNPJ: ${this.cnpj}\nIE: ${this.inscricaoEstadual}\n`;

		return loja;
	}

	public adicionarVenda(venda: Venda) {
		this.vendas.push(venda);
	}

	public vender(dataHora: Date, ccf: number, coo: number) {
		let venda: Venda = new Venda(this, dataHora, ccf, coo);
		this.adicionarVenda(venda);

		return venda;
	}

	private validarCamposObrigatorios() {
		this.endereco.dadosEndereco();

		if (isEmpty(this.nomeLoja)) {
			throw new Error(`O campo nome da loja é obrigatório`);
		}
		if (isEmpty(this.cnpj)) {
			throw new Error(`O campo CNPJ da loja é obrigatório`);
		}

		if (isEmpty(this.inscricaoEstadual)) {
			throw new Error(`O campo inscrição estadual da loja é obrigatório`);
		}
	}
}
