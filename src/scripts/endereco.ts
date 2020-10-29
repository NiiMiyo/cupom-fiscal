import { isEmpty } from "./actions";

export class Endereco {
	constructor(
		public logradouro: string,
		public numero: number,
		public complemento: string,
		public bairro: string,
		public municipio: string,
		public estado: string,
		public cep: string
	) {}

	public dadosEndereco(): string {
		this.validarCamposObrigatorios();

		let endereco: string;

		const numero = this.numero > 0 ? `${this.numero}` : "s/n";
		const complemento = !isEmpty(this.complemento)
			? ` ${this.complemento}`
			: "";
		endereco = `${this.logradouro}, ${numero}${complemento}\n`;

		const bairro = !isEmpty(this.bairro) ? `${this.bairro} - ` : "";
		endereco += `${bairro}${this.municipio} - ${this.estado}\n`;

		const cep = !isEmpty(this.cep) ? `CEP:${this.cep}` : "";
		endereco += cep;

		return endereco;
	}

	private validarCamposObrigatorios() {
		if (isEmpty(this.logradouro)) {
			throw new Error(`O campo logradouro do endereço é obrigatório`);
		}

		if (isEmpty(this.municipio)) {
			throw new Error(`O campo município do endereço é obrigatório`);
		}

		if (isEmpty(this.estado)) {
			throw new Error(`O campo estado do endereço é obrigatório`);
		}
	}
}
