/* src/app.js */

// Styles
import 'styles/_app.scss'

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

function openMenu () {
  document.querySelector('.menu__icon-burger').querySelector('.menu__mobile-burger').classList.toggle('display-none');
  document.querySelector('.menu__icon-burger').querySelector('.menu__mobile-close').classList.toggle('display-flex');
  document.querySelector('.menu__mobile-list').classList.toggle('menu__mobile-list--visible');
  document.querySelector('body').classList.toggle('overflow-hidden')
}

function openContact () {
  document.querySelector('.menu__icon-contact').querySelector('.menu__mobile-phone').classList.toggle('display-none');
  document.querySelector('.menu__icon-contact').querySelector('.menu__mobile-close').classList.toggle('display-flex');
  document.querySelector('.menu__mobile-contact').classList.toggle('menu__mobile-contact--visible');
  document.querySelector('body').classList.toggle('overflow-hidden')
}

function resizeEventListener() {
  if (document.documentElement.clientWidth <= 767) {
    const menu = document.querySelector('#menu');
    menu.querySelector('.menu__icon-burger').addEventListener('click', openMenu);
    menu.querySelector('.menu__icon-contact').addEventListener('click', openContact);
  }
}

window.onload = resizeEventListener;
window.addEventListener('resize', resizeEventListener);

function getExtension(file_name){
  return file_name.split('.').reverse()[0];
}

document.querySelector('#file-upload').onchange = function() {
  for (let i = 0; i < this.files.length; i++) {

    let ext = this.value.match(/\.([^\.]+)$/)[1];

    switch (ext) {
      case 'jpg':
      case 'png':
        console.log('Images');
        break;
      case 'pdf':
      case 'doc':
      case 'docx':
        console.log('Document');
        break;
      default:
        console.log('Not Allowed');
        this.value = '';
    }

    console.log(this.files[i].type);
    console.log(getExtension(this.files[i].name));
  }
}
