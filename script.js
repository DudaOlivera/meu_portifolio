/* SCROLL ATIVO E FECHAMENTO DO MENU */
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150; 
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
            });
            document.querySelector('header nav a[href="#' + id + '"]').classList.add('active');
        }
    });
};

/* MENU MOBILE */
menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x'); 
    navbar.classList.toggle('active'); 
};

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    });
});


/* FORMULÁRIO DE CONTATO (COM FORMSpree)*/
const form = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

const formspreeEndpoint = 'https://formspree.io/f/manlkonq';

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    
    formMessage.textContent = 'Enviando sua mensagem...';
    formMessage.classList.remove('hidden', 'error');
    formMessage.classList.add('show');

    try {
        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            formMessage.textContent = 'Mensagem enviada com sucesso!';
            formMessage.classList.remove('error');
            form.reset(); 
        } else {
            formMessage.textContent = 'Ocorreu um erro. Tente novamente.';
            formMessage.classList.add('error');
        }

    } catch (error) {
        console.error('Erro no envio:', error);
        formMessage.textContent = 'Erro de rede. Verifique sua conexão.';
        formMessage.classList.add('error');
    }

    setTimeout(() => {
        formMessage.classList.remove('show');
        formMessage.classList.add('hidden');
    }, 5000);
});