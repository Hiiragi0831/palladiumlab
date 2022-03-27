/* src/app.js */

// Styles
import 'styles/_app.scss'

$(function() {
  console.log('Ready!')

  require('scripts/demo')
})

let sliderItems = document.querySelector('#slider-main');

if (sliderItems) {
  // Hover для главного экрана
  let currentElem = null;
  let currentImg = null;
  let currentTitle = null;

  const defaultImg = sliderItems.querySelector('[data-img="block-0"]');
  const defaultTitle = sliderItems.querySelector('[data-title="block-0"]');
  const menu = document.querySelector('#menu');

  sliderItems.onmouseover = function(event) {

    // перед тем, как войти на следующий элемент, курсор всегда покидает предыдущий
    // если currentElem есть, то мы ещё не ушли с предыдущего item,
    // это переход внутри - игнорируем такое событие
    if (currentElem) return;

    let target = event.target.closest('.slider__item');

    // переход не на item - игнорировать
    if (!target) return;

    // переход на item, но вне нашей таблицы (возможно при вложенных таблицах)
    // игнорировать
    if (!sliderItems.contains(target)) return;

    // ура, мы зашли на новый item
    currentElem = target;
    currentImg = sliderItems.querySelector(`[data-img="${target.dataset.item}"]`);
    currentTitle = sliderItems.querySelector(`[data-title="${target.dataset.item}"]`);
    defaultImg.classList.remove('slider__image--active');
    defaultTitle.classList.remove('slider__title-active');


    sliderItems.querySelector('.slider__box').classList.add('slider__box-transparent')
    currentImg.classList.add('slider__image--active');
    currentTitle.classList.add('slider__title-active');
    menu.classList.add('menu-transparent');
  };


  sliderItems.onmouseout = function(event) {
    // если мы вне item, то игнорируем уход мыши
    // это какой-то переход внутри таблицы, но вне item,
    // например с item на другой item
    if (!currentElem) return;

    // мы покидаем элемент – но куда? Возможно, на потомка?
    let relatedTarget = event.relatedTarget;

    while (relatedTarget) {
      // поднимаемся по дереву элементов и проверяем – внутри ли мы currentElem или нет
      // если да, то это переход внутри элемента – игнорируем
      if (relatedTarget === currentElem) return;

      relatedTarget = relatedTarget.parentNode;
    }

    // мы действительно покинули элемент
    sliderItems.querySelector('.slider__box').classList.remove('slider__box-transparent');
    currentImg.classList.remove('slider__image--active');
    currentTitle.classList.remove('slider__title-active');
    menu.classList.remove('menu-transparent');
    defaultImg.classList.add('slider__image--active');
    defaultTitle.classList.add('slider__title-active');
    currentElem = null;
    currentImg = null;
  };
}
