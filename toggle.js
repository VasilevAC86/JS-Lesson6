function toggleInit(selector){
    const toggleNodeList = document.querySelectorAll(selector);
    toggleNodeList.forEach((toggleNode) => {
        genarateView(toggleNode); /*Отрисовка элемента на  странице*/
        setEventListener(toggleNode);
    })
}

function genarateView(node){ // Для создания других div-ов внутри div в html (Функция отрисовки элемента на стр.)
    const inputNode = document.createElement('INPUT'); // Создаём элемент
    inputNode.setAttribute('type', 'hidden'); // Задаём атрибуты вновь созданному элементу
    if(node.dataset.name){
        inputNode.setAttribute('name', node.dataset.name);
    }
    if(node.dataset.value && node.classList.contains('toggle--checked')){ // Если сущ-ет node.dataset.value элемент содержит класс toggle--checked
        inputNode.setAttribute('value', node.dataset.value);
    }    
    
    node.append(inputNode);

    const toggleSwitchNode = document.createElement('DIV'); // Создаём эл. на основе div
    toggleSwitchNode.classList.add('toggle-switch');
    node.append(toggleSwitchNode); // Добавляем вновь созданный эл. внутрь переданного
}

function setEventListener(node){ // Обработчие события клика по тумблеру
    node.addEventListener('click', () => {
        node.classList.toggle('toggle--checked'); // если класса нет, то он добавляется, если класс есть, то он удаляется
        if(node.classList.contains('toggle--checked') && node.dataset.value){
            node.querySelector('input').value = node.dataset.value;
        }
        else
            node.querySelector('input').value = null;
    })
}

toggleInit('.toggle');