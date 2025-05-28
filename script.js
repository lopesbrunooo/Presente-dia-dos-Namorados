document.addEventListener('DOMContentLoaded', function() {
    const startDate = new Date('2024-11-09T18:45:00');
    let currentImageIndex = 0;
    let carouselInterval;
    const musicPlayer = document.getElementById('music-player');
    const musicControl = document.getElementById('music-control');
    let isPlaying = false;

    function updateTimer() {
        const now = new Date();
        const diff = now - startDate;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('timer').textContent = 
            `${days} dias, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;
    }

    function showImage(index) {
        const images = document.querySelectorAll('.carousel-item');
        images[currentImageIndex].classList.remove('active');
        currentImageIndex = index;
        images[currentImageIndex].classList.add('active');
    }

    function startCarousel() {
        stopCarousel(); // Para qualquer intervalo existente
        carouselInterval = setInterval(() => {
            showImage((currentImageIndex + 1) % document.querySelectorAll('.carousel-item').length);
        }, 3000);
    }

    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    function playMusic() {
        musicPlayer.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        musicControl.classList.remove('play');
        musicControl.classList.add('pause');
        isPlaying = true;
    }

    function pauseMusic() {
        musicPlayer.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        musicControl.classList.remove('pause');
        musicControl.classList.add('play');
        isPlaying = false;
    }

    // Listener para verificar quando o player do YouTube está pronto
    window.addEventListener('message', function(event) {
        if (event.data && event.data.event === 'onReady') {
            console.log('YouTube player está pronto');
        }
    });

    document.getElementById('heart').addEventListener('click', function() {
        document.getElementById('letter').classList.remove('hidden');
        document.getElementById('letter').classList.add('show');
        updateTimer();
        setInterval(updateTimer, 1000);
        startCarousel();
        playMusic(); // Inicia a música automaticamente
    });

    document.querySelector('.letter button').addEventListener('click', function() {
        document.getElementById('letter').classList.remove('show');
        document.getElementById('letter').classList.add('hidden');
        stopCarousel();
        pauseMusic();
    });

    // Navegação manual com setas
    document.querySelector('.carousel-prev').addEventListener('click', function() {
        stopCarousel();
        const newIndex = (currentImageIndex - 1 + document.querySelectorAll('.carousel-item').length) % document.querySelectorAll('.carousel-item').length;
        showImage(newIndex);
        setTimeout(startCarousel, 5000); // Retoma a troca automática após 5 segundos
    });

    document.querySelector('.carousel-next').addEventListener('click', function() {
        stopCarousel();
        const newIndex = (currentImageIndex + 1) % document.querySelectorAll('.carousel-item').length;
        showImage(newIndex);
        setTimeout(startCarousel, 5000); // Retoma a troca automática após 5 segundos
    });

    // Controle de música
    musicControl.addEventListener('click', function() {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });
});

function closeLetter() {
    document.getElementById('letter').classList.remove('show');
    document.getElementById('letter').classList.add('hidden');
    document.getElementById('music-player').contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
}