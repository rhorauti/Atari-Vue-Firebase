export function priceRS(preco) {
    return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2}).format(preco);
}

export function formatarDataBr(data) {
    // Mon Oct 02 2023 14:57:35 GMT-0300 (Horário Padrão de Brasília)
    if(!data) return;
    const partes = data.split(' ');
    let dia = parseInt(partes[2]);
    if(dia < 10) {
        dia = '0' + dia;
    }
    const meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mes = parseInt(meses.indexOf(partes[1])) + 1;
    const ano = parseInt(partes[3]);
    // const dataFormatada = new Date(ano, mes, dia);
    if(meses.indexOf(partes[1]) >= 0 && meses.indexOf(partes[1]) < 9) {
        return dia + '/0' + mes + '/' + ano;
    } else {
        return dia + '/' + mes + '/' + ano;
    }
}

export function formatarDataInputDate(data) {
    const dataInformada = new Date(data);
    return String(dataInformada.getFullYear()) + '-' + String(dataInformada.getMonth() + 1) + '-' + String(dataInformada.getDay());
}