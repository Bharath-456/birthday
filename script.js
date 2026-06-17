document.addEventListener('DOMContentLoaded', () => {
    initAtmosphericBackdrop();
    initSimulationEngine();
});

function initSimulationEngine() {
    // Stage Element Selection Hooks
    const stepCover = document.getElementById('step-cover');
    const stepGreeting = document.getElementById('step-greeting');
    const stepBalloons = document.getElementById('step-balloons');
    const stepCandle = document.getElementById('step-candle');
    const stepBouquet = document.getElementById('step-bouquet');
    const stepLetter = document.getElementById('step-letter');
    const stepGiftbox = document.getElementById('step-giftbox');

    // UI Interactive Element Anchors
    const coverActionText = document.getElementById('cover-action-text');
    const btnGateYes = document.getElementById('btn-gate-yes');
    const btnGateNo = document.getElementById('btn-gate-no');
    const balloonCounter = document.getElementById('balloon-counter');
    const balloonGridItems = document.querySelectorAll('.balloon-item-wrap');
    const balloonOutput = document.getElementById('minigame-message-output');
    const actionMicStart = document.getElementById('action-mic-start');
    const micProgressStatus = document.getElementById('mic-progress-status');
    const candleFireGroup = document.getElementById('candle-fire-group');
    const cakeTouchBypass = document.getElementById('cake-touch-bypass');
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelopeStatusLabel = document.getElementById('envelope-status-label');
    const paperSheet = document.getElementById('paper-sheet');
    const targetTypingBody = document.getElementById('target-typing-body');
    const giftClickZone = document.getElementById('gift-click-zone');
    const giftUnveiledContent = document.getElementById('gift-unveiled-content');

    function route(from, to, lag = 400) {
        from.style.opacity = '0';
        setTimeout(() => {
            from.classList.remove('active');
            to.classList.add('active');
        }, lag);
    }

    // --- STEP 1: LANDING CONTEXT ---
    stepCover.addEventListener('click', () => {
        coverActionText.innerText = "Opening...";
        coverActionText.style.opacity = "0.5";
        setTimeout(() => { route(stepCover, stepGreeting); }, 1000);
    });

    // --- STEP 2: EVASIVE SIDE-BY-SIDE BUTTON ROUTINE ---
    function dodgeNoButton() {
        const randomX = (Math.random() * 80) - 40; 
        const randomY = (Math.random() * 120) - 60;
        btnGateNo.style.left = `${101 + randomX}px`;
        btnGateNo.style.top = `${randomY}px`;
    }
    btnGateNo.addEventListener('mouseenter', dodgeNoButton);
    btnGateNo.addEventListener('touchstart', (e) => { e.preventDefault(); dodgeNoButton(); });

    btnGateYes.addEventListener('click', () => { route(stepGreeting, stepBalloons); });

    // --- STEP 3: BALLOON POPPING ENGINE ---
    let totalPopped = 0;
    // Pre-allocate the array slots so the sentence structure is locked in order
    let narrativeTrack = ["", "", "", ""]; 

    balloonGridItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const body = item.querySelector('.balloon-body');
            if(body.style.visibility === 'hidden') return;

            body.style.visibility = 'hidden';
            totalPopped++;
            
            // Lock the word into its exact grammatical position based on the balloon's index (0 to 3)
            narrativeTrack[index] = item.getAttribute('data-fragment');
            
            // Filter out empty slots to display the words cleanly as they reveal
            balloonCounter.innerText = `${totalPopped}/4 POPPED`;
            balloonOutput.innerText = narrativeTrack.filter(word => word !== "").join(' ');

            if(totalPopped === 4) {
                setTimeout(() => { route(stepBalloons, stepCandle); }, 1500);
            }
        });
    });

    // --- STEP 4: BREATH MIC CONFIGURATOR ---
    function extinguishCandle() {
        candleFireGroup.style.display = 'none';
        micProgressStatus.innerText = "Close your eyes & make a wish";
        setTimeout(() => { 
            route(stepCandle, stepBouquet); 
            setTimeout(() => { route(stepBouquet, stepLetter); }, 4000);
        }, 2000);
    }

    actionMicStart.addEventListener('click', () => {
        actionMicStart.style.display = 'none';
        micProgressStatus.innerText = "Listening... Blow into the microphone!";

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const analyser = ctx.createAnalyser();
                    const source = ctx.createMediaStreamSource(stream);
                    analyser.fftSize = 256;
                    const dataArray = new Uint8Array(analyser.frequencyBinCount);
                    source.connect(analyser);

                    function captureAudioFrame() {
                        analyser.getByteFrequencyData(dataArray);
                        let volumeSum = dataArray.reduce((a, b) => a + b, 0);
                        if((volumeSum / dataArray.length) > 55) {
                            stream.getTracks().forEach(track => track.stop());
                            ctx.close();
                            extinguishCandle();
                        } else {
                            requestAnimationFrame(captureAudioFrame);
                        }
                    }
                    requestAnimationFrame(captureAudioFrame);
                })
                .catch(() => { setupFallbackClick(); });
        } else {
            setupFallbackClick();
        }
    });

    function setupFallbackClick() {
        micProgressStatus.innerText = "Mic blocked. Tap the birthday cake to blow it out!";
        cakeTouchBypass.style.cursor = 'pointer';
        cakeTouchBypass.addEventListener('click', extinguishCandle);
    }

    // --- STEP 6: TYPEWRITER REVEAL ---
    const textDataContent = "Dear Sowjanya(KANMANI),\n\nHappy Birthday to someone truly special! 🎂\nYou are Sweet, Loyal, My rock, and I'm so grateful to have you in my life.\nYou bring so much warmth and sweetness into my life. Every moment with you is precious.\n\nOn your special day, I wish you all the happiness, love, and joy that you deserve. May this year bring you countless beautiful moments and wonderful memories.\n\nHere's to celebrating you today and always! ✨\n\nWith love and best wishes,\nYour Special Someone 💖";

    envelopeWrapper.addEventListener('click', () => {
        envelopeWrapper.classList.add('opened');
        envelopeStatusLabel.style.opacity = '0';

        setTimeout(() => {
            envelopeWrapper.style.display = 'none';
            document.getElementById('letter-title-text').style.display = 'none';
            envelopeStatusLabel.style.display = 'none';
            paperSheet.style.display = 'flex';
            
            let cursorIdx = 0;
            function printNextChar() {
                if(cursorIdx < textDataContent.length) {
                    let char = textDataContent.charAt(cursorIdx);
                    targetTypingBody.innerHTML += (char === "\n") ? "<br>" : char;
                    cursorIdx++;
                    setTimeout(printNextChar, 30);
                } else {
                    setTimeout(() => { route(stepLetter, stepGiftbox); }, 3500);
                }
            }
            printNextChar();
        }, 600);
    });

    // --- STEP 7: FINAL GIFT BOX ---
    giftClickZone.addEventListener('click', () => {
        giftClickZone.style.display = 'none';
        giftUnveiledContent.style.display = 'flex';
    });
}

function initAtmosphericBackdrop() {
    const space = document.getElementById('space-backdrop');
    if (!space) return;

    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'cosmic-drifting-heart';
        heart.innerText = ['❤️', '💖', '💕', '✨'][Math.floor(Math.random() * 4)];
        
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 12 + 10}px`;
        heart.style.animationDuration = `${Math.random() * 5 + 5}s`;
        heart.style.setProperty('--x-drift', `${Math.random() * 60 - 30}px`);
        heart.style.setProperty('--r-drift', `${Math.random() * 60 - 30}deg`);
        heart.style.animationDelay = `${Math.random() * 6}s`;
        
        space.appendChild(heart);
    }

    for (let j = 0; j < 20; j++) {
        const dust = document.createElement('div');
        dust.className = 'cosmic-dust-particle';
        dust.style.top = `${Math.random() * 100}%`;
        dust.style.left = `${Math.random() * 100}%`;
        const size = Math.random() * 2 + 1;
        dust.style.width = `${size}px`;
        dust.style.height = `${size}px`;
        dust.style.animationDuration = `${Math.random() * 3 + 2}s`;
        space.appendChild(dust);
    }
}