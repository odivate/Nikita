
document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('image-upload');
    const songSelect = document.getElementById('song-select');
    const emotionSelect = document.getElementById('emotion-select');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const status = document.getElementById('status');
    const audioPlayer = document.getElementById('audio-player');
    const slideshowContainer = document.getElementById('slideshow');
    const playerCard = document.getElementById('player-card');
    const particlesContainer = document.getElementById('particles');
    const visualizer = document.getElementById('visualizer');
    const body = document.body;
    
    let images = [];
    let currentSlideIndex = 0;
    let slideInterval;
    let isPlaying = false;
    let audioContext;
    let analyser;
    let dataArray;
    let animationId;
    let currentParticles = [];
    
    // Create visualizer bars
    for (let i = 0; i < 64; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        visualizer.appendChild(bar);
    }
    const bars = document.querySelectorAll('.bar');
    
    // Default songs list (relative paths to your songs folder)
    const defaultSongs = [
        { name: "Pyaar Hota Kayi Baar Hai", path: "songs/Pyaar Hota Kayi Baar Hai.mp3" },
        { name: "Tainu Khabar Nahi", path: "songs/Tainu Khabar Nahi.mp3" },
        { name: "Tum Se", path: "songs/Tum Se (Song).mp3" },
        { name: "Pehli Nazar Mein", path: "songs/Pehli Nazar Mein.mp3" },
        { name: "Har Kisi Ko Nahi Milta Yahan Pyaar Zindagi Mein", path: "songs/Har Kisi Ko Nahi Milta Yahan Pyaar Zindagi Mein.mp3" },
        { name: " Gulabi Aankhen", path: "songs/Gulabi Aankhen.mp3" }
    ];
    
    // Populate the song select dropdown with default songs
    function populateSongList() {
        defaultSongs.forEach(song => {
            const option = document.createElement('option');
            option.value = song.path;
            option.textContent = song.name;
            songSelect.appendChild(option);
        });
    }
    
    // Initialize the song list
    populateSongList();
    
    // Create floating particles
    function createParticles(emotion) {
        // Clear existing particles
        particlesContainer.innerHTML = '';
        currentParticles = [];
        
        const particleCount = 20;
        
        if (emotion === 'love') {
            // Create heart particles for love emotion
            for (let i = 0; i < particleCount; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.innerHTML = '❤️';
                
                // Random size between 15px and 30px
                const size = Math.random() * 15 + 15;
                heart.style.fontSize = `${size}px`;
                
                // Random position
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.top = `${Math.random() * 100}%`;
                
                // Random animation
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                heart.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
                
                // Random rotation
                const rotation = Math.random() * 360;
                heart.style.transform = `rotate(${rotation}deg)`;
                
                // Random opacity
                heart.style.opacity = Math.random() * 0.5 + 0.3;
                
                particlesContainer.appendChild(heart);
                currentParticles.push(heart);
            }
        } else {
            // Create regular bubbles for other emotions
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Random size between 3px and 8px
                const size = Math.random() * 5 + 3;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Random position
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                
                // Random animation
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
                
                // Set color based on emotion
                if (emotion === 'playful') {
                    particle.style.backgroundColor = `rgba(${Math.floor(Math.random() * 156) + 100}, ${Math.floor(Math.random() * 156) + 100}, ${Math.floor(Math.random() * 156) + 100}, 0.7)`;
                } else if (emotion === 'sad') {
                    particle.style.backgroundColor = 'rgba(200, 200, 200, 0.5)';
                } else if (emotion === 'energetic') {
                    particle.style.backgroundColor = `rgba(${Math.floor(Math.random() * 55) + 200}, ${Math.floor(Math.random() * 100) + 50}, ${Math.floor(Math.random() * 100)}, 0.7)`;
                } else if (emotion === 'calm') {
                    particle.style.backgroundColor = 'rgba(173, 216, 230, 0.7)';
                } else if (emotion === 'mysterious') {
                    particle.style.backgroundColor = `rgba(${Math.floor(Math.random() * 50) + 100}, 0, ${Math.floor(Math.random() * 50) + 150}, 0.7)`;
                } else {
                    particle.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                }
                
                particlesContainer.appendChild(particle);
                currentParticles.push(particle);
            }
        }
    }
    
    // Add floating animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 100}px) rotate(${Math.random() > 0.5 ? '-' : ''}${Math.random() * 360}deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Setup audio analyzer
    function setupAudioAnalyzer() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        const source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
    
    // Visualize audio
    function visualize() {
        if (!analyser) return;
        
        analyser.getByteFrequencyData(dataArray);
        
        for (let i = 0; i < bars.length; i++) {
            const index = Math.floor(i * (dataArray.length / bars.length));
            const value = dataArray[index] / 255;
            const height = value * 50 + 5;
            bars[i].style.height = `${height}px`;
            bars[i].style.backgroundColor = `rgba(255, 255, 255, ${0.4 + value * 0.6})`;
        }
        
        animationId = requestAnimationFrame(visualize);
    }
    
    // Handle emotion selection
    emotionSelect.addEventListener('change', function() {
        // Remove all emotion classes
        body.className = '';
        
        // Add the selected emotion class
        if (this.value) {
            body.classList.add(this.value);
            status.textContent = `Emotion set to: ${this.options[this.selectedIndex].text}`;
            
            // Create appropriate particles for the emotion
            createParticles(this.value);
        } else {
            status.textContent = 'Select emotion, images and a song to begin';
            particlesContainer.innerHTML = '';
        }
        
        updateControls();
    });
    
    // Handle image selection
    imageUpload.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 10) {
            alert('Please select up to 10 images only.');
            return;
        }
        
        images = [];
        slideshowContainer.innerHTML = ''; // Clear previous slides
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.match('image.*')) continue;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'slide';
                if (i === 0) img.classList.add('active');
                slideshowContainer.appendChild(img);
                
                images.push(e.target.result);
                
                if (images.length === 1) {
                    updateControls();
                }
            };
            reader.readAsDataURL(file);
        }
        
        status.textContent = `Selected ${files.length} image(s). Select a song to play.`;
    });
    
    // Handle song selection
    songSelect.addEventListener('change', function() {
        if (this.value) {
            audioPlayer.src = this.value;
            updateControls();
            status.textContent = `Song selected. ${images.length} image(s) loaded. Press Play to start.`;
            
            // Setup audio analyzer when a song is selected
            if (!audioContext) {
                setupAudioAnalyzer();
            }
        } else {
            updateControls();
        }
    });
    
    // Play button
    playBtn.addEventListener('click', function() {
        if (!isPlaying) {
            if (images.length > 0 && audioPlayer.src) {
                startSlideshow();
                audioPlayer.play();
                isPlaying = true;
                updateControls();
                status.textContent = 'Playing...';
                playerCard.classList.add('playing');
                
                // Start visualization
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
                visualize();
            }
        }
    });
    
    // Pause button
    pauseBtn.addEventListener('click', function() {
        if (isPlaying) {
            clearInterval(slideInterval);
            audioPlayer.pause();
            isPlaying = false;
            updateControls();
            status.textContent = 'Paused';
            playerCard.classList.remove('playing');
            
            // Stop visualization
            cancelAnimationFrame(animationId);
        }
    });
    
    // Stop button
    stopBtn.addEventListener('click', function() {
        clearInterval(slideInterval);
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        isPlaying = false;
        currentSlideIndex = 0;
        showSlide(0);
        updateControls();
        status.textContent = 'Stopped';
        playerCard.classList.remove('playing');
        
        // Stop visualization
        cancelAnimationFrame(animationId);
        
        // Reset visualizer bars
        bars.forEach(bar => {
            bar.style.height = '5px';
            bar.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        });
    });
    
    // Start slideshow
    function startSlideshow() {
        // Shuffle images array for random order
        shuffleArray(images);
        
        // Show first slide
        currentSlideIndex = 0;
        showSlide(currentSlideIndex);
        
        // Change slide every 3 seconds
        slideInterval = setInterval(() => {
            currentSlideIndex = (currentSlideIndex + 1) % images.length;
            showSlide(currentSlideIndex);
        }, 3000);
    }
    
    // Show specific slide
    function showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) slide.classList.add('active');
        });
    }
    
    // Shuffle array function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Update control buttons state
    function updateControls() {
        const hasImages = images.length > 0;
        const hasSong = audioPlayer.src !== '';
        const hasEmotion = emotionSelect.value !== '';
        
        playBtn.disabled = !hasImages || !hasSong || !hasEmotion || isPlaying;
        pauseBtn.disabled = !isPlaying;
        stopBtn.disabled = !hasImages || !hasSong || !hasEmotion || (!isPlaying && audioPlayer.currentTime === 0);
    }
    
    // Handle audio end
    audioPlayer.addEventListener('ended', function() {
        clearInterval(slideInterval);
        isPlaying = false;
        updateControls();
        status.textContent = 'Playback completed';
        playerCard.classList.remove('playing');
        
        // Stop visualization
        cancelAnimationFrame(animationId);
    });
});
