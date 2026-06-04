from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')
marker = "// ==========================\n// ESTADO\nfunction updateStatus() {\n"
insert = """// ==========================
// VIDEO PRODUCTOS
const videoModal = document.getElementById('videoModal');
const videoFrame = document.getElementById('videoFrame');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const videoUnavailable = document.getElementById('videoUnavailable');

function openVideoModal(src) {
    if (!src || !videoModal) return;

    videoFrame.classList.add('hidden');
    videoPlayer.classList.add('hidden');
    videoUnavailable.classList.add('hidden');

    if (src.includes('youtube.com') || src.includes('youtu.be')) {
        videoFrame.src = normalizeYouTubeEmbed(src);
        videoFrame.classList.remove('hidden');
    } else {
        videoSource.src = src;
        videoPlayer.load();
        videoPlayer.classList.remove('hidden');
    }

    videoModal.classList.remove('hidden');
}

function normalizeYouTubeEmbed(src) {
    if (src.includes('youtube.com/embed/')) {
        return src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
    }

    if (src.includes('watch?v=')) {
        return src.replace('watch?v=', 'embed/') + '?autoplay=1';
    }

    if (src.includes('youtu.be/')) {
        const_id = src.split('youtu.be/').pop().split(/[?&]/)[0];
        return f'https://www.youtube.com/embed/{const_id}?autoplay=1';
    }

    return src;
}

function closeVideoModal() {
    if (!videoModal) return;

    videoFrame.src = '';
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
    }

    videoModal.classList.add('hidden');
}

function attachProductVideoListeners() {
    const videoCards = document.querySelectorAll('.product-card[data-video]');

    videoCards.forEach(card => {
        const src = card.dataset.video;

        card.addEventListener('click', () => openVideoModal(src));
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openVideoModal(src);
            }
        });
    });
}

attachProductVideoListeners();
"""
insert_text = insert + marker
if marker not in text:
    raise SystemExit('marker not found')
text = text.replace(marker, insert_text, 1)
path.write_text(text, encoding='utf-8')
print('inserted')
