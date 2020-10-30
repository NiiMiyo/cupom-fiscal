import { Endereco } from "../scripts/endereco";
import { ItemVenda } from "../scripts/itemVenda";
import { Loja } from "../scripts/loja";
import { Produto } from "../scripts/produto";
import { PagamentoProps, Venda } from "../scripts/venda";

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
Dinheiro 12.74
Troco R$ 0.00
Lei 12.741, Valor aprox., Imposto F=0.96 (7.54), E=0.61 (4.81%)
`;

const MENSAGEM_VENDA_SEM_ITENS = `É necessário pelo menos um item na venda.`;
const MENSAGEM_VENDA_QUANTIDADE_ZERO = `Quantidade inválida.`;
const MENSAGEM_VALOR_UNITARIO_ZERO = "Valor unitário inválido.";
const MENSAGEM_PRODUTO_DUPLICADO = "Produto já adicionado na venda.";
const MENSAGEM_VENDA_NAO_FINALIZADA = "A venda não foi finalizada.";
const MENSAGEM_VENDA_FINALIZADA = "Esta venda já foi finalizada.";
const MENSAGEM_PAGAMENTO_INSUFICIENTE = "O valor pago não é suficente.";
const MENSAGEM_PRODUTO_SEM_DESCRICAO =
	"A descrição do item não pode ser vazia.";

const MENSAGEM_COO_OBRIGATORIO =
	"O Contador de Ordem de Operação (COO) é obrigatório.";
const MENSAGEM_CCF_OBRIGATORIO =
	"O Contador de Cupom Fiscal (CCF) é obrigatório.";

test("Venda Completa", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto1 = new Produto(123456, "Produto1", "kg", 4.35, "");

	venda.adicionarItem(new ItemVenda(produto1, 2));

	expect(venda.dadosVendas()).toBe(TEXTO_VENDA_COMPLETA);
});

test("Validar COO", () => {
	let vendaCOO_0 = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, 0);
	verificaCampoObrigatorio(MENSAGEM_COO_OBRIGATORIO, vendaCOO_0);
});

test("Validar CCF", () => {
	let vendaCCF_0 = LOJA_COMPLETA.vender(DATA_PADRAO, 0, COO);
	verificaCampoObrigatorio(MENSAGEM_CCF_OBRIGATORIO, vendaCCF_0);
});

test("Venda com 2 itens", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto1 = new Produto(123456, "Produto1", "kg", 4.35, "");
	const produto2 = new Produto(234567, "Produto2", "m", 1.01, "");

	venda.adicionarItem(new ItemVenda(produto1, 2));
	venda.adicionarItem(new ItemVenda(produto2, 4));

	venda.finalizarVenda("dinheiro", 12.74);

	expect(venda.imprimeCupom()).toBe(TEXTO_ESPERADO_CUPOM_FISCAL_DOIS_ITENS);
});

test("Venda sem itens", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);

	verificaCampoObrigatorio(MENSAGEM_VENDA_SEM_ITENS, venda);
});

test("Venda com item quantidade 0", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto1 = new Produto(123456, "Produto1", "kg", 4.35, "");

	let mensagem;

	try {
		venda.adicionarItem(new ItemVenda(produto1, 0));
	} catch (error) {
		mensagem = error.message;
	}
	expect(mensagem).toBe(MENSAGEM_VENDA_QUANTIDADE_ZERO);
});

test("Venda com item valor 0", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto1 = new Produto(123456, "Produto1", "kg", 0, "");

	let mensagem;

	try {
		venda.adicionarItem(new ItemVenda(produto1, 5));
	} catch (error) {
		mensagem = error.message;
	}
	expect(mensagem).toBe(MENSAGEM_VALOR_UNITARIO_ZERO);
});

test("Venda com dois itens apontando para o mesmo produto", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto1 = new Produto(123456, "Produto1", "kg", 5.5, "");

	let mensagem;

	try {
		venda.adicionarItem(new ItemVenda(produto1, 5));
		venda.adicionarItem(new ItemVenda(produto1, 1));
	} catch (error) {
		mensagem = error.message;
	}

	expect(mensagem).toBe(MENSAGEM_PRODUTO_DUPLICADO);
});

test("Mudar preços negociando - Porcentagem", () => {
	const produto = new Produto(123456, "Produto1", "un", 100, "");

	const itemVenda = new ItemVenda(produto, 1, {
		tipo: "porcentagem",
		valor: 1.1,
	});

	expect(itemVenda.valorTotal().toFixed(2)).toBe("110.00");
});

test("Mudar preços negociando - Fixo", () => {
	const produto = new Produto(234567, "Produto2", "un", 100, "");

	const itemVenda = new ItemVenda(produto, 1, {
		tipo: "fixo",
		valor: 29,
	});

	expect(itemVenda.valorTotal().toFixed(2)).toBe("129.00");
});

test("Cálculo de troco", () => {
	let venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto = new Produto(234567, "Produto2", "un", 100, "");

	venda.adicionarItem(new ItemVenda(produto, 1));
	venda.finalizarVenda("dinheiro", 101);

	expect(venda.troco).toBe(1);
});

test("Troco com venda em andamento", () => {
	let venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto = new Produto(234567, "Produto2", "un", 100, "");

	venda.adicionarItem(new ItemVenda(produto, 1));

	let mensagem;

	try {
		let _ = venda.troco;
	} catch (error) {
		mensagem = error.message;
	}

	expect(mensagem).toBe(MENSAGEM_VENDA_NAO_FINALIZADA);
});

test("Adicionar item em venda finalizada", () => {
	let venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto1 = new Produto(234567, "Produto1", "un", 100, "");
	const produto2 = new Produto(123456, "Produto2", "un", 100, "");

	venda.adicionarItem(new ItemVenda(produto1, 1));
	venda.finalizarVenda("dinheiro", Infinity);

	let mensagem;
	try {
		venda.adicionarItem(new ItemVenda(produto2, 1));
	} catch (error) {
		mensagem = error.message;
	}

	expect(mensagem).toBe(MENSAGEM_VENDA_FINALIZADA);
});

test("Valor de pagamento insuficiente", () => {
	let venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto = new Produto(234567, "Produto1", "un", 100, "");

	venda.adicionarItem(
		new ItemVenda(produto, 1, { tipo: "porcentagem", valor: Infinity })
	);

	let mensagem;

	try {
		venda.finalizarVenda("dinheiro", 0);
	} catch (error) {
		mensagem = error.message;
	}

	expect(mensagem).toBe(MENSAGEM_PAGAMENTO_INSUFICIENTE);
});

test("Imprimir cupom de venda não finalizada", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto = new Produto(234567, "Produto1", "un", 100, "");

	venda.adicionarItem(new ItemVenda(produto, 1));

	let mensagem;
	try {
		venda.imprimeCupom();
	} catch (error) {
		mensagem = error.message;
	}

	expect(mensagem).toBe(MENSAGEM_VENDA_NAO_FINALIZADA);
});

test("Ver pagamento antes de finalizar venda", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto = new Produto(234567, "Produto1", "un", 100, "");

	venda.adicionarItem(new ItemVenda(produto, 1));

	let mensagem;
	try {
		let _ = venda.pagamento;
	} catch (error) {
		mensagem = error.message;
	}

	expect(mensagem).toBe(MENSAGEM_VENDA_NAO_FINALIZADA);
});

test("Ver pagamento depois de finalizar venda", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto = new Produto(234567, "Produto1", "un", 100, "");

	venda.adicionarItem(new ItemVenda(produto, 1));
	venda.finalizarVenda("credito", 100);

	const pagamento: PagamentoProps = { forma: "credito", valor: 100 };
	expect(venda.pagamento).toStrictEqual(pagamento);
});

test("Adicionar item sem descrição", () => {
	const venda = LOJA_COMPLETA.vender(DATA_PADRAO, CCF, COO);
	const produto = new Produto(234567, "", "un", 100, "");

	let mensagem;
	try {
		venda.adicionarItem(new ItemVenda(produto, 1));
	} catch (error) {
		mensagem = error.message;
	}

	expect(mensagem).toBe(MENSAGEM_PRODUTO_SEM_DESCRICAO);
});
