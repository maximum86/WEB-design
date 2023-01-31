document.getElementById('sendPayment').onclick = function () {
    if (validate_form(this.form) && save_data(this.form))
        win_info(this.form);
    return false;
};

document.getElementById("currency").onchange = function () {
    let sum = document.getElementById("sum").value;
    let currencyDivider = this.value;
    let totalSum = Math.round(sum / currencyDivider * 100) / 100;
    document.getElementById("total").value = totalSum;
    document.getElementById("commission").value = Math.round(totalSum * 0.05 * 100) /100;
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
    document.getElementById("commission").value = Math.round(totalSum * 0.05 * 100) /100;
    let curencyName = currency.options[currency.selectedIndex].text;
    let curencyCode = curencyName.substring(curencyName.length - 4, curencyName.length)
    let totalLbl = get_label(total);
    totalLbl.innerText = 'Сума, ' + curencyCode;
    let commissionLabel = get_label(commission);
    commissionLabel.innerText = 'Комісія, ' + curencyCode;
}



function validate_form(form_obj) {
    let ok = false;
    with (form_obj)
    if (payer.value.length < 6) {
        alert("Помилка: ПІБ платника");
        if (lb = get_label(payer)) alert(lb.innerText);
        payer.focus();
    }
    else if (check_mail(mail.value)) {
        alert("Помилка: адреса e-mail");
        mail.focus();
    }
    else if (check_mail(mail.value)) {
        alert("Помилка: адреса e-mail");
        mail.focus();
    }
    else if (currency.selectedIndex < 0) {
        alert("Помилка: валюта платежу");
        currency.focus();
    }
    else ok = true;
    return ok;
};

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

let data = [];
function save_data(form) {
    let obj = { payer: '', mail: '', phone: '' };
    obj.payer = form.payer.value;
    obj.phone = form.phone.value;
    obj.mail = form.mail.value;
    obj.recepient = form.recepient.value;
    obj.edrpou = form.edrpou.value;
    obj.iban = form.iban.value;
    obj.purpose = form.purpose.value;
    obj.sum = form.sum.value;
    obj.currency = form.currency.value;
    obj.total = form.total.value;
    obj.commission = form.commission.value;
    data.push(obj);
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
