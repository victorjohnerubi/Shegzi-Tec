const catalogSearch = document.querySelector('#catalog-search');

if (catalogSearch) {
    const searchInput = catalogSearch.querySelector('input[type="search"]');
    const categoryCards = [...document.querySelectorAll('[data-category-card]')];
    const searchStatus = document.querySelector('#search-status');
    const emptySearch = document.querySelector('#empty-search');

    catalogSearch.addEventListener('submit', event => event.preventDefault());

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        categoryCards.forEach(card => {
            const searchableText = `${card.textContent} ${card.dataset.searchTerms}`.toLowerCase();
            const isMatch = searchableText.includes(query);
            card.hidden = !isMatch;
            if (isMatch) {
                visibleCount += 1;
            }
        });

        searchStatus.textContent = query ? `${visibleCount} ${visibleCount === 1 ? 'category' : 'categories'} found` : '';
        emptySearch.hidden = visibleCount > 0;
    });
}

const budgetForm = document.querySelector('#budget-form');

if (budgetForm) {
    budgetForm.addEventListener('submit', event => {
        event.preventDefault();
        if (!budgetForm.reportValidity()) {
            return;
        }

        const formData = new FormData(budgetForm);
        const quantity = Number(formData.get('quantity'));
        const budget = Number(formData.get('budget'));

        if (!Number.isSafeInteger(quantity) || quantity < 1 || !Number.isSafeInteger(budget) || budget < 1) {
            document.querySelector('#budget-status').textContent = 'Enter a whole-number quantity and budget greater than zero.';
            return;
        }

        const message = `Hello Shegzi-Tech, please suggest products for ${quantity} items with a maximum budget of ₦${budget.toLocaleString('en-NG')}.`;
        window.open(`https://wa.me/2348164142389?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    });
}

const contactForm = document.querySelector('#contact-form');

if (contactForm) {
    const contactStatus = document.querySelector('#contact-status');
    const emailSubmitButton = contactForm.querySelector('button[type="submit"]');
    const whatsappSubmitButton = document.querySelector('#contact-whatsapp-submit');
    const emailJsServiceId = 'service_6en872p';
    const emailJsTemplateId = 'template_xyaksak';
    const emailJsPublicKey = 'JA-I_fNBH_Eyqfz9f';

    const serviceField = contactForm.elements.namedItem('service');
    const requestedService = new URLSearchParams(window.location.search).get('service');
    if (serviceField && requestedService) {
        const matchingOption = [...serviceField.options].find(option => option.value === requestedService || option.textContent === requestedService);
        const requestedCategory = /art|design|logo/i.test(requestedService) ? 'Graphic & Brand Design'
            : /banner|sign|poster|large-format/i.test(requestedService) ? 'Large-Format Printing'
                : /pack|merchandise|apparel|shirt|drinkware|gift|sample/i.test(requestedService) ? 'Custom Merchandise & Packaging'
                    : /stationery|card|flyer|brochure/i.test(requestedService) ? 'Business Stationery'
                        : 'Other';
        serviceField.value = matchingOption ? matchingOption.value : requestedCategory;
    }

    contactForm.addEventListener('submit', async event => {
        event.preventDefault();
        if (!contactForm.reportValidity()) {
            return;
        }

        if (!window.emailjs) {
            contactStatus.textContent = 'Email service is unavailable right now. Please try WhatsApp or email us directly.';
            return;
        }

        emailSubmitButton.disabled = true;
        contactStatus.textContent = 'Sending your request…';

        try {
            await window.emailjs.sendForm(emailJsServiceId, emailJsTemplateId, contactForm, {
                publicKey: emailJsPublicKey
            });
            contactForm.reset();
            contactStatus.textContent = 'Your email request was sent successfully. We’ll be in touch soon.';
        } catch (error) {
            console.error('EmailJS contact request failed:', error);
            contactStatus.textContent = 'We could not send your request. Please try WhatsApp or email us directly.';
        } finally {
            emailSubmitButton.disabled = false;
        }
    });

    whatsappSubmitButton.addEventListener('click', () => {
        if (!contactForm.reportValidity()) {
            return;
        }

        const formData = new FormData(contactForm);
        const details = [
            `Hello Shegzi-Tech, my name is ${formData.get('name')}.`,
            formData.get('email') ? `Email: ${formData.get('email')}.` : '',
            `Phone/WhatsApp: ${formData.get('phone')}.`,
            `Project: ${formData.get('service')}.`,
            formData.get('quantity') ? `Quantity: ${formData.get('quantity')}.` : '',
            formData.get('message') ? `Details: ${formData.get('message')}` : '',
            formData.get('artwork') && formData.get('artwork').name ? `Artwork file selected: ${formData.get('artwork').name}. Please remind me to attach it here.` : ''
        ].filter(Boolean);

        const whatsappWindow = window.open(`https://wa.me/2348164142389?text=${encodeURIComponent(details.join('\n'))}`, '_blank', 'noopener,noreferrer');
        if (whatsappWindow) {
            contactStatus.textContent = 'WhatsApp opened with your request. Please review and send the message there.';
        } else {
            contactStatus.textContent = 'Your browser blocked the WhatsApp window. Please allow pop-ups or use the floating WhatsApp button.';
        }
    });
}
