const portfolioGrid = document.querySelector('#portfolio-grid');

if (portfolioGrid) {
    const cards = [...portfolioGrid.querySelectorAll('.portfolio-card')];
    const filters = [...document.querySelectorAll('.portfolio-filter')];
    const status = document.querySelector('#portfolio-status');
    const emptyState = document.querySelector('#portfolio-empty');

    filters.forEach(button => {
        const category = button.dataset.filter;
        const count = category === 'all'
            ? cards.length
            : cards.filter(card => card.dataset.category === category).length;
        button.querySelector('.filter-count').textContent = `(${count})`;

        button.addEventListener('click', () => {
            const selectedCategory = button.dataset.filter;
            let visibleCount = 0;

            filters.forEach(filter => {
                const isActive = filter === button;
                filter.classList.toggle('is-active', isActive);
                filter.setAttribute('aria-pressed', String(isActive));
            });

            cards.forEach(card => {
                const isVisible = selectedCategory === 'all' || card.dataset.category === selectedCategory;
                card.hidden = !isVisible;
                if (isVisible) {
                    visibleCount += 1;
                }
            });

            status.textContent = `${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'} shown`;
            emptyState.hidden = visibleCount > 0;
        });
    });

    status.textContent = `${cards.length} portfolio samples shown`;

    const lightbox = document.querySelector('#portfolio-lightbox');
    const lightboxImage = document.querySelector('#portfolio-lightbox-image');
    const lightboxCaption = document.querySelector('#portfolio-lightbox-caption');
    const lightboxClose = document.querySelector('#portfolio-lightbox-close');

    if (lightbox && lightboxImage && lightboxCaption && lightboxClose) {
        cards.forEach(card => {
            const image = card.querySelector('img');
            const overlay = card.querySelector('.portfolio-card-overlay');
            if (!image || !overlay) {
                return;
            }

            const previewButton = document.createElement('button');
            previewButton.className = 'portfolio-lightbox-trigger';
            previewButton.type = 'button';
            previewButton.textContent = 'Enlarge sample';
            previewButton.setAttribute('aria-label', `Enlarge image: ${image.alt}`);
            previewButton.addEventListener('click', () => {
                lightboxImage.src = image.src;
                lightboxImage.alt = image.alt;
                lightboxCaption.textContent = card.querySelector('.portfolio-card-caption h3')?.textContent || image.alt;
                lightbox.showModal();
            });
            overlay.append(previewButton);
        });

        lightboxClose.addEventListener('click', () => lightbox.close());
        lightbox.addEventListener('click', event => {
            if (event.target === lightbox) {
                lightbox.close();
            }
        });
        lightbox.addEventListener('close', () => {
            lightboxImage.removeAttribute('src');
            lightboxImage.alt = '';
            lightboxCaption.textContent = '';
        });
    }
}
