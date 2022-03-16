
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 20
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button */
   
  $('.back-to-top').click( function(){
    select('#container').classList.toggle('chatbot')

  })

  $('.bi-chevron-compact-down').click( function(){
    select('#container').classList.toggle('chatbot')

  })



  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()



/**
 * Returns the current datetime for the message creation.
 */
 function getCurrentTimestamp() {
	return new Date();
}
let previousCount = 0

/**
 * Renders a message on the chat screen based on the given arguments.
 * This is called from the `showUserMessage` and `showBotMessage`.
 */
function renderMessageToScreen(args) {
  
  // count messajes
  previousCount = previousCount+1;
  
// local variables
let displayDate = (args.time || getCurrentTimestamp()).toLocaleString('en-IN', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	});


	let messagesContainer = $('.messages');

	// init element
	let message = $(`
	<li class="message ${args.message_side}">
		<div class="avatar"></div>
		<div class="text_wrapper">
			<div class="text">${args.text}</div>
			<div class="timestamp">${displayDate}</div>
		</div>
	</li>
	`);

	// add to parent
	messagesContainer.append(message);

	// animations
	setTimeout(function () {
      message.addClass('appeared');
    }, 0);

    messagesContainer.animate({ scrollTop: messagesContainer.prop('scrollHeight') }, 300);

    

  }
/**
/* Displays the user message on the chat screen. This is the right side message.
*/
function showUserMessage(message, datetime) {
  if (message !== ""){ 
  renderMessageToScreen({
  text: message,
  time: datetime,
  message_side: 'right',
  }); } 
  }

/** * Displays the chatbot message on the chat screen. This is the left side message.
*/

function showBotMessage(data, datetime) {  
  
    renderMessageToScreen({
      text: data,
      time: datetime,
      message_side: 'left',
      });
    
  
  }
function getResponse(arg){
  if (arg !== ""){
   

    $.get("/get", { msg: arg }).done(function(data) {
      showBotMessage(data)
      })

  }
 ;}

/**
* Get input from user and show it on screen on button click.
*/
$('#send_button').on('click', function (e) {
// get and show message and reset input
let valordemierda = $('#msgInput').val(); $('#msgInput').val('');
 
    showUserMessage(valordemierda);
    getResponse(valordemierda)

});

$("#msgInput").keypress(function(e) {
  //if enter key is pressed
          if(e.which == 13 ) {
          let valordemierda = $('#msgInput').val(); $('#msgInput').val('')    
            showUserMessage(valordemierda);
            getResponse(valordemierda)
        }


  });

/**
* Set initial bot message to the screen for the user.
*/

// $("#send_button").click(function() {
   //     g
   // });

/**
* 
*/

   function renderBubble () {
    Array.from(document.getElementsByClassName('notification-container')).forEach((item) => {
      

        let circ = document.createElement('div');
        circ.classList.add("notification-circle");

        let value = previousCount;
        let position = item.getAttribute('data-pos');
        let color = item.getAttribute('data-color');
        let click_state = item.getAttribute('data-select-hide');

        

        const offsetValue = "-10px";

        // Position
        switch (position) {
            case "top":
                circ.style.top = offsetValue;
                break;

            case "top-right":
                circ.style.top = offsetValue;
                circ.style.right = offsetValue;
                break;

            case "top-left":
                circ.style.top = offsetValue;
                circ.style.left = offsetValue;
                break;

            case "bottom":
                circ.style.bottom = offsetValue;
                break;

            case "bottom-right":
                circ.style.bottom = offsetValue;
                circ.style.right = offsetValue;
                break;

            case "bottom-left":
                circ.style.bottom = offsetValue;
                circ.style.left = offsetValue;
                break;


            default:
                circ.style.top = offsetValue;
                circ.style.right = offsetValue;
                break;
        }


        if (!['top', 'top-right', 'top-left', 'bottom', 'bottom-right', 'bottom-left', null].includes(position)) {
            console.error('Unsupported position ', position);
        }


        // Color
        if (color === "") {
            circ.style.backgroundColor = "red";
        }
        circ.style.backgroundColor = color;


        // Data
        if (value >= 1000 && value < 100000) {
            circ.innerHTML = `+${(value / 1000).toFixed(1)}K`;
        } else if (value >= 100000) {
            circ.innerHTML = `+${(value / 1000000).toFixed(1)}M`;
        }
        else {
            circ.innerHTML = value; // check if is a number
        }


        // Touch Listener 
        function shrink() {
            circ.classList.add('circle-shrink');
        };

        if (click_state == null || click_state === "true" || click_state === "True") {
            item.addEventListener('click', shrink);
          //  previousCount =0;
        } else if (click_state == 'false' || click_state == 'False') {
            // No need to add the event listener
            item.style.cursor = "default"
        }

        if (!['true', 'false', 'True', 'False', null].includes(click_state)) {
            console.error('Unsupported value: ', click_state)
        }


        // Default number value
        if (value == "" || value < 0) {
            value = '0';
            circ.innerHTML = value;
        }


        // 
        item.appendChild(circ);

    })
}

$(window).on('load', function () {
	showBotMessage('Hola en que puedo ayudarte??');
  showBotMessage('Si el logo te parece malo, tenes que ver este video <a href="https://youtu.be/jVhlJNJopOQ" target="_blank" class="linkedin">VIDEO </i></a>');
  showBotMessage('Aprende algo de cultura general');
  renderBubble();
});