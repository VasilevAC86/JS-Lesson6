function initSlider(selector) {
    const sliderNodeList = document.querySelectorAll(selector);
    sliderNodeList.forEach((sliderNode) => {
        sliderGenerateView(sliderNode); /*Отрисовка элемента на  странице*/
        setSliderEventListner(sliderNode);
    })
}

function sliderGenerateView(node){ /*Функция отрисовки элемента на стр.*/
    const minValue = Number((node.dataset.min) ? node.dataset.min : 0);
    const maxValue = Number((node.dataset.max) ? node.dataset.max : 100);
    let startValue = Number((node.dataset.value) ? node.dataset.value : minValue);
    // Проверка позиции ползунка от пользователя
    startValue = (startValue < minValue) ? minValue : startValue;
    startValue = (startValue > maxValue) ? maxValue : startValue;
    
    const percentValue = (maxValue - minValue) / 100 * startValue; // Процент ползунка (ширина эл. с ползунком)

    const inputNode = document.createElement('INPUT'); // Создаём эл. на основе input
    inputNode.classList.add('slider__input');
    inputNode.setAttribute('type', 'number');
    inputNode.value=startValue;
    node.append(inputNode) // Добавляем вновь созданный эл. внутрь переданного

    const sliderScaleNode = document.createElement('DIV'); // Создаём эл. на основе div
    sliderScaleNode.classList.add('slider__scale');
   
    const sliderFillNode = document.createElement('DIV'); // Создаём эл. на основе div
    sliderFillNode.classList.add('slider__fill');
    sliderFillNode.style.width = percentValue + '%';
    
    const sliderPointNode = document.createElement('DIV');
    sliderPointNode.classList.add('slider__pointer');

    sliderScaleNode.append(sliderFillNode); // Объединяем эл.
    sliderScaleNode.append(sliderPointNode);
    node.append(sliderScaleNode);

    setSliderPointer(sliderScaleNode, sliderPointNode, percentValue);
}

function setSliderPointer(sliderScaleNode, sliderPointNode, percentValue){ // Установка точки-ползунка
     // Получаем объект со значениями: 
     //  - расстояние от левого края стр. до левого края эл.
     //  - расстояние от правого края стр. до правого края эл.
     //  - расстояние от верхнего края стр. до верхнего края эл.
     //  - расстояние от нижнего края стр. до нижнего края эл.
     //  - высоту и ширину элемента
     const sliderRectPos = sliderScaleNode.getBoundingClientRect();
     const startX = sliderRectPos.left; //  - расстояние от левого края стр. до левого края эл.
     const endX = startX + sliderRectPos.width;
     const pointX = (endX - startX) / 100 * percentValue;
     sliderPointNode.style.left = (pointX - 5) + 'px';
}

function setSliderEventListner(node){ 
    window.addEventListener('resize', () => { // Функция для смещения точки-ползунка при изменении размеров страницы
        const minValue = Number((node.dataset.min) ? node.dataset.min : 0);
        const maxValue = Number((node.dataset.max) ? node.dataset.max : 100);        
        
        const pointerNode = node.querySelector('.slider__pointer');
        const inputNode = node.querySelector('.slider__input');
        const scaleNode = node.querySelector('.slider__scale')
        const percentValue = (maxValue - minValue) / 100 * inputNode.value; // чтобы узнать текущее значение input

        setSliderPointer(scaleNode, pointerNode, percentValue);
        
    })
    let isMove = false;
    node.querySelector('.slider__pointer').addEventListener('mousedown', () => {
         isMove = true;
    })

    document.addEventListener('mouseup', () => {
       isMove = false;
    })

    document.addEventListener('mousemove', (e) => {
        if(isMove){
            const cursorX = e.pageX;
            node.querySelector('.slider__pointer').style.left = cursorX + 'px';
        }
    })
}

initSlider('.slider')