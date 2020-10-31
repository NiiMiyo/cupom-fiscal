import { isEmpty } from "./actions";

export class ImpressoraFiscal {
	constructor(
		public readonly modelo: string,
		public readonly versaoEcfIf: string,
		public readonly ecf: string,
		public readonly serial: string
	) {}

	dadosImpressora(): string {
		this.validarImpressora();
		return `${this.modelo}\nECF-IF VERSÃO: ${this.versaoEcfIf} ECF: ${this.ecf}\nFAB: ${this.serial}`;
	}

	validarImpressora() {
		if (isEmpty(this.modelo)) {
			throw new Error("Modelo de impressora fiscal inválido.");
		}

		if (isEmpty(this.versaoEcfIf)) {
			throw new Error("Versão do ECF-IF da impressora fiscal inválida.");
		}

		if (isEmpty(this.ecf)) {
			throw new Error("ECF da impressora fiscal inválido.");
		}

		if (isEmpty(this.serial)) {
			throw new Error("Serial da impressora fiscal inválido.");
		}
	}
}
