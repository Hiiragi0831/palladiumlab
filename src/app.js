/* src/app.js */

// Styles
import 'styles/_app.scss'

//////////////////////////////////
// Hover для главного экрана
let sliderItems = document.querySelector('#slider-main');

if (sliderItems) {
  let currentElem = null;
  let currentImg = null;
  let currentTitle = null;

  const defaultImg = sliderItems.querySelector('[data-img="block-0"]');
  const defaultTitle = sliderItems.querySelector('[data-title="block-0"]');
  const menu = document.querySelector('#menu');

  sliderItems.onmouseover = (event) => {

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


  sliderItems.onmouseout = (event) => {
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

//////////////////////////////////
// Мобильное меню
const resizeEventListener = () => {
  if (document.documentElement.clientWidth <= 767) {
    const menu = document.querySelector('#menu');
    menu.querySelector('.menu__icon-burger').addEventListener('click', () => {
      document.querySelector('.menu__icon-burger').querySelector('.menu__mobile-burger').classList.toggle('display-none');
      document.querySelector('.menu__icon-burger').querySelector('.menu__mobile-close').classList.toggle('display-flex');
      document.querySelector('.menu__mobile-list').classList.toggle('menu__mobile-list--visible');
      document.querySelector('body').classList.toggle('overflow-hidden');
    });
    menu.querySelector('.menu__icon-contact').addEventListener('click', () => {
      document.querySelector('.menu__icon-contact').querySelector('.menu__mobile-phone').classList.toggle('display-none');
      document.querySelector('.menu__icon-contact').querySelector('.menu__mobile-close').classList.toggle('display-flex');
      document.querySelector('.menu__mobile-contact').classList.toggle('menu__mobile-contact--visible');
      document.querySelector('body').classList.toggle('overflow-hidden');
    });
  }
}

window.onload = resizeEventListener;
window.addEventListener('resize', resizeEventListener);

//////////////////////////////////
// форма загрузки

document.querySelector('#file').addEventListener('click', function () {
  document.querySelector('#form-file').classList.toggle('display-flex');
});

const getExtension = (file_name) => {
  let type = file_name.split('.').reverse()[0];
  return type.substring(0, 3);
}

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const createFileTemplate = (text) => (
  `<div class="contact__form-file-item">
    <p>${text}</p>
  </div>`
);

const createImgTemplate = (src) => (
  `<div class="contact__form-file-item">
    <img src="${src}"  alt=""/>
  </div>`
);

const createFileItem = (fileType) => {
  let box = document.querySelector('.contact__form-box');
  renderTemplate(box, createFileTemplate(fileType), RenderPosition.AFTERBEGIN);
}

const createImgItem = (url) => {
  let box = document.querySelector('.contact__form-box');
  renderTemplate(box, createImgTemplate(url), RenderPosition.AFTERBEGIN);
}

document.querySelector('#file-upload').onchange = function (env) {
  for (let i = 0; i < this.files.length; i++) {

    let ext = this.value.match(/\.([^\.]+)$/)[1];

    switch (ext) {
      case 'jpg':
      case 'png':
        console.log('Images');
        createImgItem(URL.createObjectURL(env.target.files[i]));
        break;
      case 'pdf':
      case 'doc':
      case 'docx':
        createFileItem(getExtension(this.files[i].name));
        console.log('Document');
        break;
      default:
        console.log('Not Allowed');
        this.value = '';
    }
  }
}

//////////////////////////////////
// валидатор

// выход true/false
const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};


const form = document.querySelector('.contact__form');
const label = form.querySelectorAll('.contact__form-label');
const nameLabel = form.querySelector('#form-name');
const feedbackLabel = form.querySelector('#form-feedback');
const messageLabel = form.querySelector('#form-text');
const fileId = form.querySelector('#form-file');

form.addEventListener('submit', (evn) => {
  inputValidate();

  if (nameLabel.dataset.success === '1' && feedbackLabel.dataset.success === '1' && messageLabel.dataset.success === '1') {
    nameLabel.classList.remove('contact__form-label--success');
    feedbackLabel.classList.remove('contact__form-label--success');
    messageLabel.classList.remove('contact__form-label--success');

    nameLabel.querySelector('input').value = '';
    feedbackLabel.querySelector('input').value = '';
    messageLabel.querySelector('input').value = '';

    nameLabel.dataset.success = '0';
    feedbackLabel.dataset.success = '0';
    messageLabel.dataset.success = '0';

    fileId.querySelector('input').value = '';
    fileId.querySelectorAll('.contact__form-file-item').forEach(item => item.remove())
    fileId.classList.remove('display-flex');

  } else {
    evn.preventDefault();
  }

});

const filledField = () => {
  for (let i = 0; i < label.length; i++) {
    const input = label[i].querySelector('input');
    input.addEventListener('input', () => {
      if (input.value.length !== 0) {
        label[i].classList.add('contact__form-label--filled');
      } else {
        label[i].classList.remove('contact__form-label--filled');
      }
    });
  }

  fileId.querySelector('input').addEventListener('input', () => {
    if (fileId.querySelector('input').value.length !== 0 ) {
      form.querySelector('#form-text').classList.add('contact__form-label--filled');
    } else {
      form.querySelector('#form-text').classList.remove('contact__form-label--filled');
    }
  });
}

filledField();




const error = (label, textError) => {
  label.classList.remove('contact__form-label--filled');
  label.classList.remove('contact__form-label--success');
  label.classList.add('contact__form-label--error');
  label.querySelector('.contact__form-error').style.display = 'block';
  label.querySelector('.contact__form-error').innerText= textError;
  label.dataset.success = '0';
}

const success = (label) => {
  label.classList.remove('contact__form-label--filled');
  label.classList.remove('contact__form-label--error');
  label.classList.add('contact__form-label--success');
  label.querySelector('.contact__form-error').style.display = 'none';
  label.dataset.success = '1';
}

const verification = (label, errorText) => {
  label.querySelector('input').value.length > 0 ? success(label) : error(label, errorText);

  label.querySelector('input').addEventListener('input', () => {
    label.querySelector('input').value.length > 0 ? success(label) : error(label, errorText);
  });
}

const inputValidate = () => {
  verification(nameLabel, 'Напишите имя');
  verification(feedbackLabel, 'Напишите телефон или почту');

  if (messageLabel.querySelector('input').value.length > 0 || fileId.querySelector('input').value.length > 0) {
    success(messageLabel);
  } else {
    error(messageLabel, 'Напишите или прикрепите обращение');
  }

  fileId.querySelector('input').addEventListener('input', () => {
    if (fileId.querySelector('input').value.length > 0 || messageLabel.querySelector('input').value.length > 0) {
      success(messageLabel);
    } else {
      error(messageLabel, 'Напишите или прикрепите обращение');
    }
  });

  messageLabel.querySelector('input').addEventListener('input', () => {
    if (fileId.querySelector('input').value.length > 0 || messageLabel.querySelector('input').value.length > 0) {
      success(messageLabel);
    } else {
      error(messageLabel, 'Напишите или прикрепите обращение');
    }
  });
}
