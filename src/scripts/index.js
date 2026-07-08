// Esperamos a que todo el contenido del DOM se cargue
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Funcionalidad para cerrar el menú hamburguesa en móviles
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const menuToggle = document.getElementById('navbarPortafolio');
  
  navLinks.forEach(link => {

    link.addEventListener('click', () => {

      // Verificamos si el menú está abierto (tiene la clase 'show')
      if (menuToggle.classList.contains('show')) {

        // Utilizamos la API de Bootstrap para ocultarlo de forma animada
        const bsCollapse = new bootstrap.Collapse(menuToggle, {

          toggle: false

        });
        bsCollapse.hide();

      }

    });

  });

  // 2. Efecto para resaltar el enlace activo en la Navbar al hacer scroll
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {

    let current = '';
    
    sections.forEach(section => {

      const sectionTop = section.offsetTop;
      // Restamos un poco de espacio para que el cambio suceda antes de llegar exactamente al tope
      if (scrollY >= (sectionTop - 150)) {

        current = section.getAttribute('id');

      }

    });

    navLinks.forEach(link => {

      // Removemos la clase activa de todos los enlaces
      link.classList.remove('active');
      // Si el enlace coincide con la sección actual, le agregamos la clase activa
      if (link.getAttribute('href').includes(current)) {

        link.classList.add('active');

      }

    });

  });

  // 3. Funcionalidad del Modal de Certificados
  const certButtons = document.querySelectorAll('.btn-ver-cert');
  const certModalImage = document.getElementById('certificadoModalImagen');

  if (certButtons.length > 0 && certModalImage) {
    certButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Obtenemos la ruta de la imagen desde el atributo 'data-cert-src' del botón clickeado
        const imgSrc = this.getAttribute('data-cert-src');
        // Asignamos esa ruta a la imagen dentro del modal
        certModalImage.setAttribute('src', imgSrc);
      });
    });
  }

  // 4. Funcionalidad del Formulario de Contacto (Integración Formspree)
  const form = document.getElementById('contactoForm');
  const formAlert = document.getElementById('formAlert');
  const btnSubmit = document.getElementById('btnSubmit');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Evita que la página se recargue

      const nombreUsuario = document.getElementById('nombre').value;

      // Estado de carga en el botón
      const textoOriginalBtn = btnSubmit.innerHTML;
      btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';
      btnSubmit.disabled = true;

      try {
        // Petición real a tu endpoint de Formspree
        const response = await fetch('https://formspree.io/f/xdavawvv', {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Éxito: Configuramos la alerta estilo pastel
          formAlert.className = 'alert mt-4 rounded-4 text-center border-0 fade show';
          formAlert.style.backgroundColor = 'var(--success-pastel)';
          formAlert.style.color = '#1D1B20';
          formAlert.innerHTML = `<i class="bi bi-check-circle-fill me-2 text-success"></i>¡Gracias por tu mensaje, <strong>${nombreUsuario.split(' ')[0]}</strong>! Me pondré en contacto contigo pronto.`;
          
          form.reset(); // Limpiamos el formulario
        } else {
          // Error desde Formspree (ej. validación fallida)
          formAlert.className = 'alert mt-4 rounded-4 text-center border-0 fade show bg-danger text-white';
          formAlert.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>Hubo un problema al enviar tu mensaje. Por favor, intenta de nuevo.`;
        }
      } catch (error) {
        // Error de red
        formAlert.className = 'alert mt-4 rounded-4 text-center border-0 fade show bg-danger text-white';
        formAlert.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>Error de conexión. Verifica tu internet e intenta de nuevo.`;
      } finally {
        // Restauramos el botón a su estado original independientemente del resultado
        btnSubmit.innerHTML = textoOriginalBtn;
        btnSubmit.disabled = false;

        // Ocultamos la alerta después de 6 segundos
        setTimeout(() => {
          formAlert.classList.remove('show');
          setTimeout(() => formAlert.classList.add('d-none'), 150);
        }, 6000);
      }
    });
  };

  // 5. Carrusel de Certificaciones (Scroll con ratón y Efecto de Enfoque)
  const certContainer = document.querySelector('.cert-scroll-container');
  const certCards = document.querySelectorAll('.cert-card');

  if (certContainer && certCards.length > 0) {
    
    // A) Permitir hacer scroll horizontal con la rueda vertical del ratón
    certContainer.addEventListener('wheel', (evt) => {
      // Evita que la página haga scroll vertical mientras el ratón esté sobre el carrusel
      evt.preventDefault(); 
      // Desplaza el contenedor horizontalmente
      certContainer.scrollLeft += evt.deltaY;
    });

    // B) Detectar qué tarjeta está en el centro exacto para agrandarla
    const updateActiveCard = () => {
      // Encontramos la coordenada central del contenedor en la pantalla
      const containerRect = certContainer.getBoundingClientRect();
      const containerCenter = containerRect.left + (containerRect.width / 2);
      
      let closestCard = null;
      let closestDistance = Infinity;

      // Iteramos sobre todas las tarjetas para ver cuál está más cerca del centro
      certCards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + (cardRect.width / 2);
        const distance = Math.abs(containerCenter - cardCenter);

        if (distance <= closestDistance) {
          closestDistance = distance;
          closestCard = card;
        }
      });

      // Removemos la clase 'active-card' de todas las tarjetas
      certCards.forEach(card => card.classList.remove('active-card'));
      
      // Agregamos la clase solo a la tarjeta ganadora (la más centrada)
      if (closestCard) {
        closestCard.classList.add('active-card');
      }
    };

    // Escuchamos el evento de scroll para actualizar el tamaño en tiempo real
    certContainer.addEventListener('scroll', updateActiveCard);
    
    // Ejecutamos la función una vez al cargar para que la primera tarjeta inicie grande
    updateActiveCard();
  }

  // 6. Funcionalidad del Modal de Galería (Brochure y Presentación)
  const botonesGaleria = document.querySelectorAll('.btn-abrir-galeria');
  const carouselInner = document.getElementById('galeriaCarouselInner');

  // Define aquí las rutas exactas de las imágenes que exportaste
  const imagenesGaleria = {
    brochure: [
      '/assets/brochure/Diapositiva1.webp',
      '/assets/brochure/Diapositiva2.webp',
      '/assets/brochure/Diapositiva3.webp',
      '/assets/brochure/Diapositiva4.webp',
      '/assets/brochure/Diapositiva5.webp',
      '/assets/brochure/Diapositiva6.webp',
      '/assets/brochure/Diapositiva7.webp',
      '/assets/brochure/Diapositiva8.webp',
      '/assets/brochure/Diapositiva9.webp',
      '/assets/brochure/Diapositiva10.webp',
      '/assets/brochure/Diapositiva11.webp',
      '/assets/brochure/Diapositiva12.webp',
      '/assets/brochure/Diapositiva13.webp',
      '/assets/brochure/Diapositiva14.webp',
      '/assets/brochure/Diapositiva15.webp',
      '/assets/brochure/Diapositiva16.webp',
    ],
    presentacion: [
      '/assets/presentacion/image1.webp',
      '/assets/presentacion/image2.webp',
      '/assets/presentacion/image3.webp',
      '/assets/presentacion/image4.webp',
      '/assets/presentacion/image5.webp',
      '/assets/presentacion/image6.webp',
      '/assets/presentacion/image7.webp',
      '/assets/presentacion/image8.webp',
      '/assets/presentacion/image9.webp',
      '/assets/presentacion/image10.webp',
      '/assets/presentacion/image12.webp',
      '/assets/presentacion/image13.webp',
      '/assets/presentacion/image14.webp',
      '/assets/presentacion/image15.webp',
      '/assets/presentacion/image16.webp',
      '/assets/presentacion/image17.webp',
      '/assets/presentacion/image18.webp',
      '/assets/presentacion/image19.webp',
      '/assets/presentacion/image20.webp',
    ]
  };

  if (botonesGaleria.length > 0 && carouselInner) {
    botonesGaleria.forEach(boton => {
      boton.addEventListener('click', function () {
        const tipoGaleria = this.getAttribute('data-galeria');
        const imagenes = imagenesGaleria[tipoGaleria];

        // Limpiamos el carrusel antes de abrirlo
        carouselInner.innerHTML = '';

        // Inyectamos las nuevas imágenes al HTML
        imagenes.forEach((imgSrc, index) => {
          const activeClass = index === 0 ? 'active' : ''; // La primera imagen debe tener la clase 'active'
          const itemHTML = `
            <div class="carousel-item ${activeClass}">
              <img src="${imgSrc}" class="d-block w-100" alt="${tipoGaleria} página ${index + 1}" style="object-fit: contain; max-height: 85vh; background-color: #f8f9fa;">
            </div>
          `;
          carouselInner.insertAdjacentHTML('beforeend', itemHTML);
        });
      });
    });
  }

});

