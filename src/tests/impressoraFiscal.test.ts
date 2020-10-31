import { ImpressoraFiscal } from "../scripts/impressoraFiscal";

function verificaCampoObrigatorio(
	mensagemEsperada: string,
	impressora: ImpressoraFiscal
): void {
	let mensagemErro;
	try {
		impressora.dadosImpressora();
	} catch (error) {
		mensagemErro = error.message;
	}
	expect(mensagemErro).toBe(mensagemEsperada);
}

const IMPRESSORA = new ImpressoraFiscal(
	"SWEDA IF ST200",
	"01.00.05",
	"067",
	"SW031300000000045629"
);

const MODELO = "SWEDA IF ST200";
const VERSAO_ECFIF = "01.00.05";
const ECF = "067";
const SERIAL = "SW031300000000045629";

const TEXTO_IMPRESSORA_COMPLETA = `SWEDA IF ST200
ECF-IF VERSÃO: 01.00.05 ECF: 067
FAB: SW031300000000045629`;

const MENSAGEM_MODELO_INVALIDO = "Modelo de impressora fiscal inválido.";

const MENSAGEM_VERSAO_ECFIF_INVALIDA = "Versão do ECF-IF da impressora fiscal inválida.";

const MENSAGEM_ECF_INVALDIO = "ECF da impressora fiscal inválido.";

const MENSAGEM_SERIAL_INVALIDO = "Serial da impressora fiscal inválido.";

test("Impressora Completa", () => {
	const impressora = new ImpressoraFiscal(MODELO, VERSAO_ECFIF, ECF, SERIAL);
	expect(impressora.dadosImpressora()).toBe(TEXTO_IMPRESSORA_COMPLETA);
});

test("Impressora com modelo inválido", () => {
	const impressora = new ImpressoraFiscal("", VERSAO_ECFIF, ECF, SERIAL);
	verificaCampoObrigatorio(MENSAGEM_MODELO_INVALIDO, impressora);
});

test("Impressora com Versão do ECF-IF inválida", () => {
	const impressora = new ImpressoraFiscal(MODELO, "", ECF, SERIAL);
	verificaCampoObrigatorio(MENSAGEM_VERSAO_ECFIF_INVALIDA, impressora);
});

test("Impressora com ECF inválido", () => {
	const impressora = new ImpressoraFiscal(MODELO, VERSAO_ECFIF, "", SERIAL);
	verificaCampoObrigatorio(MENSAGEM_ECF_INVALDIO, impressora);
});

test("Impressora com Serial inválido", () => {
	const impressora = new ImpressoraFiscal(MODELO, VERSAO_ECFIF, ECF, "");
	verificaCampoObrigatorio(MENSAGEM_SERIAL_INVALIDO, impressora);
});
