"use strict"

// Валидация форм. Начало
// Стандартная проверка на то, что документ уже загружен
document.addEventListener('DOMContentLoaded', function () { 
    const form = document.getElementById('form');
    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();

        let error = formValidate(form);

        let formData = new FormData(form);
        formData.append('image', formImage.files[0]);

        if (error === 0) {
            form.classList.add('_sending');
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                let result = await response.json();
                alert(result.message);
                formPreview.innerHTML = '';
                form.reset();
                form.classList.remove('_sending');
            } else {
                alert("Ошибка");
                form.classList.remove('_sending');
            }
        } else {
            alert('Заполните обязательные поля');
        }
    }


    function formValidate(form) {
        let error = 0;
// класс req присваивается тем полям, которые обязательны для заполнения
        let formReq = document.querySelectorAll('.req');

// обязательные поля положили в переменную formReq и с помощью цикла их проверяем
        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);

// цикл для проверки поля email
            if (input.classList.contains('email')){
                if (emailTest(input)){
                    formAddError(input);
                    error++;
                }
// проверка чекбокса и включен ли чекбокс
            } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
                formAddError(input);
                error++;
            } 
// проверка заполнено ли поле
            else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }
// Добавляет обьекту и его родителю класс error
    function formAddError(input) {
        input.parentElement.classList.add('error');
        input.classList.add('error');
    }
// Удаляет у обьекта и его родителя класс error
    function formRemoveError(input) {
        input.parentElement.classList.remove('error');
        input.classList.remove('error');
    }
// Функция для проверки поля email
    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

// Получаем инпут file в переменную 
    const formImage = document.getElementById('formImage');
// Получаем DIV для превью в переменную
    const formPreview = document.getElementById('formPreview');

// Слушаем изменения в инпуте file
    formImage.addEventListener('change', () => {
        uploadFile(formImage.files[0]);
    });

    function uploadFile(file) {
        // Проверка типа файла
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert('Разрешены только изображения.');
            formImage.value = '';
            return;
        }
        // проверим размер файла (<2 Мб)
        if (file.size > 2 * 1024 * 1024) {
            alert('Файл должен быть менее 2 МБ.');
            return;
        }

        let reader = new FileReader();
        reader.onload = function (e) {
            formPreview.innerHTML = `<img src="${e.target.result}" alt ="Фото">`;
        };
        reader.onerror = function (e) {
            alert('Ошибка');
        };
        reader.readAsDataURL(file);
    }
});