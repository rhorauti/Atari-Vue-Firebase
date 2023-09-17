export function priceRS(preco) {
    return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2}).format(preco);
}

export function formatarDataBr(data) {
    if(!data) return;
    const partes = data.split(' ');
    let dia = parseInt(partes[2]);
    if(dia < 10) {
        dia = '0' + dia;
    }
    const meses = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mes = parseInt(meses.indexOf(partes[1])) + 1;
    const ano = parseInt(partes[3]);
    const dataFormatada = new Date(ano, mes, dia);
    if(meses.indexOf(partes[1] >= 0 && partes[1] < 9)) {
        return dia + '/0' + dataFormatada.getMonth() + '/' + dataFormatada.getFullYear();
    } else {
        return dia + '/' + dataFormatada.getMonth() + '/' + dataFormatada.getFullYear();
    }
}