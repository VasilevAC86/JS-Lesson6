class Slider{
    constructor(sliderNode){
        this.conteinerNode = sliderNode; // контейнер,в который входят все эл. слайдера
        this.scaleNode = sliderNode.querySelector('.slider__scale'); // Шкала слайдера
        this.fillNode = sliderNode.querySelector('.slider__fill'); // Заполнение шкалы слайдера
        this.pointerNode = sliderNode.querySelector('.slider__pointer'); // Бегунок слайдера
        this.inputNode = sliderNode.querySelector('.slider__input'); // Значение слайдера в числах (%)
        this.currentValue = this.getStartValue(); // текущение значение диапазона для пользователя
        const scaleNodeRect = this.scaleNode.getBoundingClientRect(); // объект с координатами
        this.startX = scaleNodeRect.left;
        this.endX = scaleNodeRect.width + this.startX;
        this.isMove = false; // Двигается ли ползунок или нет

        this.onResizeListner = this.onResizeListner.bind(this) // bind(this) - чтобы не потерять контекст
        this.onMouseDownListner = this.onMouseDownListner.bind(this);
        this.onMouseUpListner = this.onMouseUpListner.bind(this);
        this.onMouseMoveListner = this.onMouseMoveListner.bind(this);
        this.onInputListner = this.onInputListner.bind(this);
        this.onClickListner = this.onClickListner.bind(this);

        this.setEventListners();
        this.setValue(this.currentValue);
    }

    getMinValue(){
        return Number(this.conteinerNode.dataset.min || 0);
    }

    getMaxValue(){
        return Number(this.conteinerNode.dataset.max || 100);
    }
    getStartValue(){ // Числовое значение в %
        let rawValue = Number(this.conteinerNode.dataset.value || this.getMinValue());
        rawValue = (rawValue < this.getMinValue()) ? this.getMinValue() : rawValue;
        rawValue = (rawValue > this.getMaxValue()) ? this.getMaxValue() : rawValue;
        return rawValue;
    }
    getPercentValue(value){ // Получение значения % по значению input
        return ((this.getMaxValue() - this.getMinValue()) / 100) * this.getMinValue() + value;
    }
    getXValue(percent){ // получение координаты по проценту        
        return (this.endX - this.startX) / 100 * percent;
    }
    getPercentByX(){ // Получение % по координате        
        return ((x - this.startX) * 100) / this.endX - this.startX;
    }
    getValueByPercent(percent){ // По проценту получаем конкретное значение поля input
        return Math.round((this.getMaxValue() - this.getMinValue()) / 100 * percent);
    }
    setPointer(){ // по значению currentValue должен устанавливать бегунок по определённой координате
        this.pointerNode.style.left = this.getXValue(this.getPercentValue(this.currentValue)) - 5 + 'px';
        this.fillNode.style.width = this.getPercentValue(this.currentValue); // заполняем поле цветом до бегунка
    }
    setValue(value){ // Перемещение бегунка при установке значения в input
        value = value < this.getMinValue() ? this.getMinValue() : value;
        value = value > this.getMaxValue() ? this.getMaxValue() : value;
        this.inputNode.value = value;
        this.currentValue = value;
        this.setPointer(); // Устанавливаем бегунок
    }
    setX(x){ // Куда кликнул пользователь, проверяем коорлинату (выход за границу и выставляем бегунок и input)
        x = x < this.startX ? this.startX : x;
        x = x > this.endX ? this.endX : x;
        this.currentValue = this.getValueByPercent(this.getPercentByX(x));
        this.inputNode.value = this.currentValue;
        this.setPointer();
    }
    onResizeListner(){ // Обработчик при изменении размеров окна
        this.setPointer();
    }
    onMouseDownListner(){
        this.isMove = true;
    }
    onMouseUpListner(){
        this.isMove = false;
    }
    onMouseMoveListner(e){
        if(this.isMove){
            this.setX(e.pageX) // Координаты мыши относительно страницы
        }
    }
    onInputListner(){ // ввод % c клавиатуры
        this.setValue(this.inputNode.value);
    }
    onClickListner(){ // Перемещение ползунка по клику мыши
        this.setX(e.pageX)
    }
    setEventListners(){ // Метод назначения обработчиков
        window.addEventListener('resize', this.onResizeListner); // без () т.к. мы передаём ф. как обработчик (параметр)
        this.pointerNode.addEventListener('mousedown', this.onMouseDownListner); 
        document.addEventListener('mouseup', this.onMouseUpListner);
        document.addEventListener('mousemove', this.onMouseMoveListner);
        this.inputNode.addEventListener('input', this.onInputListner);
        this.scaleNode.addEventListener('click', this.onClickListner);
    }

    static createView(node){
        const inputNode = document.createElement('INPUT'); // Создаём эл. на основе input
        inputNode.classList.add('slider__input');
        inputNode.setAttribute('type', 'number');        
        node.append(inputNode) // Добавляем вновь созданный эл. внутрь переданного

        const sliderScaleNode = document.createElement('DIV'); // Создаём эл. на основе div
        sliderScaleNode.classList.add('slider__scale');
    
        const sliderFillNode = document.createElement('DIV'); // Создаём эл. на основе div
        sliderFillNode.classList.add('slider__fill');        
        
        const sliderPointNode = document.createElement('DIV');
        sliderPointNode.classList.add('slider__pointer');

        sliderScaleNode.append(sliderFillNode); // Объединяем эл.
        sliderScaleNode.append(sliderPointNode);
        node.append(sliderScaleNode);        
    }

    static init(){        
        const nodeList = document.querySelectorAll('.slider');
        return Array.from(nodeList).map((node) => { // Явное преобразование в массив
            Slider.createView(node); // Создаём наполнение слайдеров
            return new Slider(node);
        });
    }
}

Slider.init();