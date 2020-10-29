// import { ItemVenda } from "../scripts/itemVenda";

import { Endereco } from "../scripts/endereco";
import { ItemVenda } from "../scripts/itemVenda";
import { Loja } from "../scripts/loja";
import { Venda } from "../scripts/venda";

function verificaCampoObrigatorio(mensagemEsperada: string, venda: Venda) {
	let mensagemErro;
	try {
		venda.imprimeCupom();
	} catch (e) {
		mensagemErro = e.message;
	}
	expect(mensagemErro).toBe(mensagemEsperada);
}

const NOME_LOJA = "Loja 1";
const LOGRADOURO = "Log 1";
const NUMERO = 10;
const COMPLEMENTO = "C1";
const BAIRRO = "Bai 1";
const MUNICIPIO = "Mun 1";
const ESTADO = "E1";
const CEP = "11111-111";
const TELEFONE = "(11) 1111-1111";
const OBSERVACAO = "Obs 1";
const CNPJ = "11.111.111/1111-11";
const INSCRICAO_ESTADUAL = "123456789";

const LOJA_COMPLETA = new Loja(
	NOME_LOJA,
	new Endereco(
		LOGRADOURO,
		NUMERO,
		COMPLEMENTO,
		BAIRRO,
		MUNICIPIO,
		ESTADO,
		CEP
	),
	TELEFONE,
	OBSERVACAO,
	CNPJ,
	INSCRICAO_ESTADUAL
);

const DATA_PADRAO = new Date(2020, 11, 25, 10, 30, 40);
const CCF = 21784;
const COO = 35804;

const VENDA_COMPLETA = new Venda(LOJA_COMPLETA, DATA_PADRAO, CCF, COO);

const TEXTO_VENDA_COMPLETA = "25/11/2020 10:30:40V CCF:021784 COO: 035804";

const TEXTO_ESPERADO_CUPOM_FISCAL_DOIS_ITENS = `Loja 1
Log 1, 10 C1
Bai 1 - Mun 1 - E1
CEP:11111-111 Tel (11) 1111-1111
Obs 1
CNPJ: 11.111.111/1111-11
IE: 123456789
------------------------------
25/11/2020 10:30:40V CCF:021784 COO: 035804
   CUPOM FISCAL   
ITEM CODIGO DESCRICAO QTD UN VL UNIT(R$) ST VL ITEM(R$)
1 123456 Produto1 2 kg 4.35  8.70
2 234567 Produto2 4 m 1.01  4.04
------------------------------
TOTAL R$ 12.74
`;

const MENSAGEM_VENDA_SEM_ITENS = `É necessário pelo menos um item na venda.`;
const MENSAGEM_VENDA_QUANTID_0 = `Quantidade inválida.`;
const MENSAGEM_VALOR_UNITARI_0 = "Valor unitário inválido";

test("Venda Completa", () => {
	const venda = new Venda(LOJA_COMPLETA, DATA_PADRAO, CCF, COO);
	venda.adicionarItem(
		new ItemVenda(1, 123456, "Produto1", 2, "kg", 4.35, "")
	);

	expect(venda.dadosVendas()).toBe(TEXTO_VENDA_COMPLETA);
});

test("Validar COO", () => {
	let vendaCOO_0 = new Venda(LOJA_COMPLETA, DATA_PADRAO, CCF, 0);
	verificaCampoObrigatorio(
		"O Contador de Cupom Fiscal (COO) é obrigatório.",
		vendaCOO_0
	);
});

test("Validar CCF", () => {
	let vendaCCF_0 = new Venda(LOJA_COMPLETA, DATA_PADRAO, 0, COO);
	verificaCampoObrigatorio(
		"O Contador de Cupom Fiscal (CCF) é obrigatório.",
		vendaCCF_0
	);
});

test("Venda com 2 itens", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	venda.adicionarItem(
		new ItemVenda(1, 123456, "Produto1", 2, "kg", 4.35, "")
	);
	venda.adicionarItem(new ItemVenda(2, 234567, "Produto2", 4, "m", 1.01, ""));

	expect(venda.imprimeCupom()).toBe(TEXTO_ESPERADO_CUPOM_FISCAL_DOIS_ITENS);
});

test("Venda sem itens", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);

	verificaCampoObrigatorio(MENSAGEM_VENDA_SEM_ITENS, venda);
});

test("Venda com item quantidade 0", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);

	let mensagem;

	try {
		venda.adicionarItem(
			new ItemVenda(1, 123456, "Produto1", 0, "kg", 4.35, "")
		);
	} catch (error) {
		mensagem = error.message;
	}
	expect(mensagem).toBe(MENSAGEM_VENDA_QUANTID_0);
});

test("Venda com item valor 0", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);

	let mensagem;

	try {
		venda.adicionarItem(
			new ItemVenda(1, 123456, "Produto1", 5, "kg", 0, "")
		);
	} catch (error) {
		mensagem = error.message;
	}
	expect(mensagem).toBe(MENSAGEM_VALOR_UNITARI_0);
});
