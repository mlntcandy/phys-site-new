document.getElementById('content').classList.add('testpage');
var emptyQuestionsExist = false;

var globalAnswers = {};

var disableSubmitButton = function() {
    document.getElementById("submitButton").setAttribute("disabled", "disabled");
}

var throwEmpty = function() {
    emptyQuestionsExist = true;
    return "NONE";
}
var submitButton = function() {
    globalAnswers = collectAnswers();
    var error = "";
    if (emptyQuestionsExist) error = '<h5 class="error">У вас есть неотвеченные задания!</h5>'
    var html = `${error}<h3>Что вы хотите сделать?</h3>
    <a class="option check" href="#" onclick="submitCheckTest()">Проверить ответы</a>
    <a class="option send" href="#" onclick="showTeacherForm()">Отправить ответы на почту учителю</a>
    <div id="teacherform">
      <h4>Отправка учителю</h4>
      <div>
        <input type="email" name="email" placeholder="Почта учителя">
        <input type="text" name="name" placeholder="Ваше ФИО">
        <input type="text" name="group" placeholder="Класс (группа)">
        <button onclick="submitCheckTest(true)">Отправить</button>
      </div>
    </div>`;
    popup.init();
    popup.populate(html);
    popup.show();
}
var showTeacherForm = function() {
    document.getElementById("teacherform").style.maxHeight = "500px";
}

var collectAnswers = function() {
    emptyQuestionsExist = false;
    var questions = document.getElementsByClassName("testq");
    var answers = {};
    for (let i = 0; i < questions.length; i++) {
        var answer = [];
        let qnum = questions[i].getAttribute('question');
        switch (questions[i].getAttribute('q_type')) {
            case 'test_o':
                if (!questions[i].querySelector(`input[name=q${qnum}]:checked`)) {
                    answer = throwEmpty();
                } else {
                    answer = questions[i].querySelector(`input[name=q${qnum}]:checked`).value;
                }
                
                answer = 'test_o:' + answer;
            break;
            case 'test_m':
                if (!questions[i].querySelector(`input[name=q${qnum}]:checked`)) {
                    answer = throwEmpty();
                } else {
                    var chboxes = questions[i].querySelectorAll(`input[name=q${qnum}]:checked`);
                    console.log(chboxes)
                    for (let ni = 0; ni < chboxes.length; ni++) {
                        answer.push(chboxes[ni].value);
                    }
                    answer = answer.join(',');
                }
                answer = 'test_m:' + answer;
            break;
            case 'text':
                if (!questions[i].querySelector(`input[name=q${qnum}]`).value) {
                    answer = throwEmpty();
                } else {
                    answer = questions[i].querySelector(`input[name=q${qnum}]`).value;
                }
                answer = 'text:' + answer;
            break;
        }
        answers[qnum] = answer;
    }
        
    answers.testname = window.location.pathname;

    return answers;
}

var submitCheckTest = function(email = false) {
    
    var xhr = new XMLHttpRequest();

    var body = '';
    if (email) {
        globalAnswers.email = {
            email: document.querySelector("#teacherform > div > input[type=email]:nth-child(1)").value,
            name: document.querySelector("#teacherform > div > input[type=text]:nth-child(2)").value,
            group: document.querySelector("#teacherform > div > input[type=text]:nth-child(3)").value
        };
        if (globalAnswers.email.email == '' || globalAnswers.email.name == '' || globalAnswers.email.group == '') {
            return alert('Не все поля заполнены!')
        } else {
            globalAnswers.email = JSON.stringify(globalAnswers.email);
            popup.hide();
        }
    } else {
        popup.hide();
    }
    for (var key in globalAnswers) { // encoding to URL parameters
        if (body != "") {
            body += "&";
        }
        body += key + "=" + encodeURIComponent(globalAnswers[key]);
    }

    xhr.open("POST", '/validatetest', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (!email) {
                var res = JSON.parse(this.responseText);
                console.log(res);
                for (let r in res.questions) {
                    if (res.questions[r]) { var acol = '#00ff0033'; } else { var acol = '#ff000033'; }
                    document.querySelector(`div[question="${r}"]`).style.backgroundColor = acol;
                }
                var result = {
                    r: res.result.r,
                    o: res.result.o,
                    p: Math.floor((res.result.r/res.result.o)*1000)/10
                }
                document.getElementById("loadingField").innerHTML = `Правильно ${result.r} из ${result.o} - ${result.p}%`;
            } else {
                document.getElementById("loadingField").innerHTML = `Письмо отправлено!`;
            }
            
        }
    }
    disableSubmitButton();
    console.log(body);
    xhr.send(body);

    // console.log(answers)
}