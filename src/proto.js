Number.prototype.toRS = function(){
    return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2}).format(this);
};
Number.prototype.toFix = function(n){
    return this.valueOf().toFixed(n).replace(/\./g, ',');
};
Number.prototype.toPx = function(d){
    return Math.round(this.valueOf() / 25.4 * d);
};
Number.prototype.toMm = function(d){
    return Math.round(this.valueOf() / d * 25.4);
};
Number.prototype.toCasasDecimais = function(n){
    return Math.round(this.valueOf() * Math.pow(10, n)) / Math.pow(10, n);
}

String.prototype.soNumeros = function() {
    return this.valueOf().replace(/\D+/g, '');
}
String.prototype.toNum = function() {
    return parseInt(this.valueOf().replace(/\D+/g, ''));
}
Date.prototype.toBrShort = function(){
    return new Intl.DateTimeFormat('pt-BR').format(this.valueOf());
};
Date.prototype.toBrLong = function(){
    let r = new Intl.DateTimeFormat('pt-BR',  {day:'2-digit', month:'2-digit', year: 'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false}).format(this.valueOf());
    let a = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return r.substring(0, 3) + a[parseInt(r.substring(3,5))] + r.substring(5);
};