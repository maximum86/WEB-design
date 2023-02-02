document.getElementById('sendPayment').onclick = function () {
    if (validate_form(this.form)) {
        save_data(this.form);
        add_data();
    }
    return false;
};

document.addEventListener("DOMContentLoaded", add_data);

document.getElementById("currency").onchange = function () {
    let sum = document.getElementById("sum").value;
    let currencyDivider = this.value;
    let totalSum = Math.round(sum / currencyDivider * 100) / 100;
    document.getElementById("total").value = totalSum;
    document.getElementById("commission").value = Math.round(totalSum * 0.05 * 100) / 100;
    let curencyName = this.options[this.selectedIndex].text;
    let curencyCode = curencyName.substring(curencyName.length - 4, curencyName.length)
    let totalLbl = get_label(total);
    totalLbl.innerText = 'Сума, ' + curencyCode;
    let commissionLabel = get_label(commission);
    commissionLabel.innerText = 'Комісія, ' + curencyCode;
}

document.getElementById("sum").onchange = function () {
    let currency = document.getElementById("currency");
    let totalSum = Math.round(this.value / currency.value * 100) / 100;
    document.getElementById("total").value = totalSum;
    document.getElementById("commission").value = Math.round(totalSum * 0.05 * 100) / 100;
    let curencyName = currency.options[currency.selectedIndex].text;
    let curencyCode = curencyName.substring(curencyName.length - 4, curencyName.length)
    let totalLbl = get_label(total);
    totalLbl.innerText = 'Сума, ' + curencyCode;
    let commissionLabel = get_label(commission);
    commissionLabel.innerText = 'Комісія, ' + curencyCode;
}

function validate_form2(form_obj) {
    let ok = false;
    with (form_obj)
    if (payer.value.split(' ').length <= 2) {
        alert("Помилка: ПІБ платника, повинно містити Прізвище Ім'я По-батькові");
        if (lb = get_label(payer)) alert(lb.innerText);
        payer.focus();
    }
    else if (check_mail(mail.value)) {
        alert("Помилка: адреса e-mail");
        mail.focus();
    }
    else if (recepient.value.length < 8) {
        alert("Помилка: Одержувач, повинно містити мінімум 8 символів");
        if (lb = get_label(recepient)) alert(lb.innerText);
        recepient.focus();
    }
    else if (edrpou.value.length != 8) {
        alert("Помилка: ЄДРПОУ, повинно містити 8 цифр");
        if (lb = get_label(edrpou)) alert(lb.innerText);
        edrpou.focus();
    }
    else if (iban.value.length != 29) {
        alert("Помилка: IBAN, повинно містити 29 символів");
        if (lb = get_label(iban)) alert(lb.innerText);
        iban.focus();
    }
    else if (purpose.value.length < 10) {
        alert("Помилка: Призначення платежу, заповніть Призначення платежу, мінімум 10 символів");
        if (lb = get_label(purpose)) alert(lb.innerText);
        purpose.focus();
    }
    else if (currency.selectedIndex < 0) {
        alert("Помилка: валюта платежу");
        currency.focus();
    }
    else if (sum.value < 1) {
        alert("Помилка: Сума платежу, повинна бути більше 0");
        if (lb = get_label(sum)) alert(lb.innerText);
        sum.focus();
    }
    else ok = true;
    return ok;
};

function validate_form(form) {
    var ok = true;
    with (form) {
        ok = err_msg(payer, payer.value.split(' ').length <= 2) && ok;
        pat = new RegExp(phone.pattern);
        ok = err_msg(phone, !pat.test(phone.value)) && ok;
        ok = err_msg(mail, check_mail(mail.value)) && ok;
        ok = err_msg(recepient, recepient.value.length < 8) && ok;
        ok = err_msg(edrpou, edrpou.value.length != 8) && ok;
        ok = err_msg(iban, iban.value.length != 29) && ok;
        ok = err_msg(purpose, purpose.value.length < 10) && ok;
        ok = err_msg(sum, sum.value < 1) && ok;
    }
    return ok;
}

function get_label(el) {
    let lbls = el.form.getElementsByTagName('label');
    for (l = 0; l < lbls.length; l++) {
        if (lbls[l].control && (lbls[l].control.id == el.id))
            return lbls[l];
    }
    return 0;
}

let ban_list = Array('mail.ru', 'yandex.ru', 'list.ru');
function check_mail(mail) {
    let i,
        pos_a,
        pos_dot;
    for (i = 0; i < ban_list.length; i++) {
        if (ban_list[i] ==
            mail.substr(mail.length - ban_list[i].length)) {
            alert(ban_list[i] + ' is banned');
            return 1;
        }
    }
    if (mail.length < 6) return 2;
    pos_a = mail.indexOf('@');
    if (pos_a < 1) return 2;
    pos_dot = mail.indexOf('.', pos_a);
    if (pos_dot <= (pos_a + 1)) return 2;
    return 0;
}

let tlog = [];
function save_data(form) {
    if(sessionStorage.getItem('transactionLog')){
        tlog = JSON.parse(sessionStorage.getItem("transactionLog")); 
    }
    let obj = { payer: '', phone: '', mail: '', recepient: '', edrpou: '', iban: '', purpose: '', sum: '', currency: '', total: '', commission: '' };
    obj.payer = form.payer.value;
    obj.phone = form.phone.value;
    obj.mail = form.mail.value;
    obj.recepient = form.recepient.value;
    obj.edrpou = form.edrpou.value;
    obj.iban = form.iban.value;
    obj.purpose = form.purpose.value;
    obj.sum = form.sum.value;
    obj.currency = form.currency.options[form.currency.selectedIndex].text;
    obj.total = form.total.value;
    obj.commission = form.commission.value;
    tlog.push(obj);
    sessionStorage.setItem('transactionLog', JSON.stringify(tlog));
    return true;
}

function win_info(frm) {
    if (w = window.open('', 'info', 'width=600,height=600')) with
        (w.document) {
            open();

            write('<!DOCTYPE html><html><body><head><style> th {text- \
            align: right; padding - right: 5px } </style ></head > <h3>Платіж проведено</h3>');
            let dt = new Date(); // поточна дата та час
            write(dt.toUTCString() + '<br/><br/><table>');
            let els = frm.elements;
            for (i = 0; i < els.length; i++) if (els[i].type != 'button') {
                let lb = get_label(els[i]);
                if (lb)
                    write('<tr><th align= "right">' + lb.innerText + ':   ' + '<td>' + els[i].value);
            }
            write('</table></body></html>');
            close();
            w.focus();
            setTimeout('w.close()', 50000);
        }
}

function err_msg(obj, error) {
    var msg = '',
        err_label;
    err_label = document.getElementById(obj.name + '_err');
    if (!error) {
        if (err_label) {
            err_label.innerText = 'OK';
            err_label.className = 'msg_ok';
        }
        return true;
    }
    if (lb = get_label(obj)) msg = 'Помилка вводу: ' + lb.innerText;
    else msg = 'Помилка вводу';
    if (err_label) {
        err_label.innerText = msg;
        err_label.className = 'msg_err';
    }
    else alert(msg);
    obj.focus();
    return false;
}

function add_data() {
    if(sessionStorage.getItem('transactionLog')){
        tlog = JSON.parse(sessionStorage.getItem("transactionLog")); 
    } else {
        tlog = [];
    } 
    var rows = "";
    var header = '<tr><th>'+'ПІБ платника'+'</th><th>'+'Телефон'+'</th>'+
    '<th>'+'e-mail'+'</th>'+'<th>'+'Одержувач'+'</th>'+
    '<th>'+'ЄДРПОУ'+'</th>'+'<th>'+'IBAN'+'</th>'+
    '<th>'+'Призначення'+'</th>'+'<th>'+'Сума, UAH'+'</th>'+
    '<th>'+'currency'+'</th>'+'<th>'+'Сума'+'</th>'+'<th>'+'Комісія'+'</th></tr>';
    rows = header;
    tlog.map((row)=>{
        var row = '<tr><td>'+row.payer+'</td>'+'<td>'+row.phone+'</td>'+'<td>'+row.mail+'</td>'+
        '<td>'+row.recepient+'</td>'+'<td>'+row.edrpou+'</td>'+'<td>'+row.iban+'</td>'+
        '<td>'+row.purpose+'</td>'+'<td>'+row.sum+'</td>'+'<td>'+row.currency+'</td>'+
        '<td>'+row.total+'</td>'+'<td>'+row.commission+'</td></tr>';
        rows = rows+row;
    })
    var tbody = document.getElementById("transactions");
    tbody.innerHTML = rows;
}
