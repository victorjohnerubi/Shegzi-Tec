const customizer = document.querySelector('#customizer-product-select');

if (customizer) {
    const storageKey = 'shegziTechQuoteItems';
    const products = {
        tumbler: { name: 'Vacuum Travel Tumbler (500ml)', imprint: 'Laser engraving' },
        polo: { name: 'Corporate Polo Shirt', imprint: 'Embroidery or screen print' },
        tote: { name: 'Branded Tote Bag', imprint: 'Screen print' },
        notebook: { name: 'Executive Notebook & Pen', imprint: 'UV or foil print' }
    };
    const productStage = document.querySelector('#customizer-product');
    const quantityInput = document.querySelector('#customizer-quantity');
    const imprintInput = document.querySelector('#customizer-imprint');
    const speedInput = document.querySelector('#customizer-speed');
    const previewCaption = document.querySelector('#customizer-preview-caption');
    const customizerStatus = document.querySelector('#customizer-status');
    const cartItemsElement = document.querySelector('#quote-cart-items');
    const cartCountElement = document.querySelector('#quote-cart-count');
    const cartQuantityElement = document.querySelector('#quote-cart-quantity');
    const clearCartButton = document.querySelector('#quote-cart-clear');
    const quoteForm = document.querySelector('#quote-request-form');
    const quoteStatus = document.querySelector('#quote-status');
    const quoteSubmitButton = document.querySelector('#quote-submit');
    const emailJsServiceId = 'service_6en872p';
    const emailJsTemplateId = 'template_xyaksak';
    const emailJsPublicKey = 'JA-I_fNBH_Eyqfz9f';
    let selectedColor = { name: 'Matte Black', value: '#171717' };
    let logoPreviewUrl = '';
    let quoteItems = [];

    try {
        const savedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (!Array.isArray(savedItems) || savedItems.some(item =>
            !item || typeof item.id !== 'string' || typeof item.productId !== 'string' ||
            !products[item.productId] || typeof item.quantity !== 'number' ||
            !Number.isSafeInteger(item.quantity) || item.quantity < 10 ||
            typeof item.color !== 'string' || typeof item.imprint !== 'string' ||
            typeof item.speed !== 'string'
        )) {
            throw new Error('Saved quote list has an invalid format.');
        }
        quoteItems = savedItems;
    } catch (error) {
        console.error('Could not load the saved quote list:', error);
        quoteStatus.textContent = 'We could not load your saved quote list. Clear this browser’s site data to start a new list.';
    }

    function renderQuoteItems() {
        cartItemsElement.replaceChildren();
        const totalQuantity = quoteItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = `(${quoteItems.length})`;
        cartQuantityElement.textContent = String(totalQuantity);
        clearCartButton.hidden = quoteItems.length === 0;

        if (quoteItems.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'quote-cart-empty';
            emptyMessage.textContent = 'Your quote list is empty. Add a customized product to get started.';
            cartItemsElement.append(emptyMessage);
            return;
        }

        quoteItems.forEach(item => {
            const card = document.createElement('article');
            card.className = 'quote-cart-item';

            const heading = document.createElement('div');
            heading.className = 'quote-cart-item-heading';
            const productName = document.createElement('h3');
            productName.textContent = products[item.productId].name;
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'quote-cart-remove';
            removeButton.textContent = 'Remove';
            removeButton.setAttribute('aria-label', `Remove ${products[item.productId].name} from quote list`);
            removeButton.addEventListener('click', () => {
                quoteItems = quoteItems.filter(quoteItem => quoteItem.id !== item.id);
                persistAndRender();
            });
            heading.append(productName, removeButton);

            const details = document.createElement('p');
            details.textContent = `${item.quantity} units · ${item.color} · ${item.imprint} · ${item.speed}`;
            card.append(heading, details);
            cartItemsElement.append(card);
        });
    }

    function persistAndRender() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(quoteItems));
            quoteStatus.textContent = '';
        } catch (error) {
            console.error('Could not save the quote list:', error);
            quoteStatus.textContent = 'Your browser could not save this list. Keep this page open while preparing your request.';
        }
        renderQuoteItems();
    }

    function updatePreview() {
        const product = products[customizer.value];
        const selectedOption = customizer.options[customizer.selectedIndex];
        productStage.style.backgroundColor = selectedColor.value;
        productStage.dataset.product = customizer.value;
        previewCaption.textContent = `${selectedOption.textContent} · ${selectedColor.name}`;
        document.querySelector('#customizer-placeholder').style.color = selectedColor.value === '#f4f4f5' ? '#171717' : '#fff';
        customizerStatus.textContent = product ? '' : 'Select a valid product to continue.';
    }

    customizer.addEventListener('change', updatePreview);
    document.querySelectorAll('.customizer-swatch').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.customizer-swatch').forEach(swatch => {
                const isSelected = swatch === button;
                swatch.classList.toggle('is-selected', isSelected);
                swatch.setAttribute('aria-pressed', String(isSelected));
            });
            selectedColor = { name: button.dataset.colorName, value: button.dataset.color };
            updatePreview();
        });
    });

    document.querySelector('#customizer-logo-upload').addEventListener('change', event => {
        const file = event.currentTarget.files[0];
        const image = document.querySelector('#customizer-logo-preview');
        const placeholder = document.querySelector('#customizer-placeholder');
        if (logoPreviewUrl) {
            URL.revokeObjectURL(logoPreviewUrl);
            logoPreviewUrl = '';
        }
        image.hidden = true;
        placeholder.hidden = false;

        if (!file) {
            return;
        }
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
            event.currentTarget.value = '';
            customizerStatus.textContent = 'Choose a PNG, JPEG or WebP logo smaller than 5 MB.';
            return;
        }

        logoPreviewUrl = URL.createObjectURL(file);
        image.src = logoPreviewUrl;
        image.hidden = false;
        placeholder.hidden = true;
        customizerStatus.textContent = 'Logo preview loaded. Send the artwork separately when our team replies.';
    });

    document.querySelector('#customizer-add').addEventListener('click', () => {
        const quantity = Number(quantityInput.value);
        if (!products[customizer.value] || !Number.isSafeInteger(quantity) || quantity < 10) {
            customizerStatus.textContent = 'Choose a product and enter a whole-number quantity of at least 10.';
            quantityInput.focus();
            return;
        }

        quoteItems.push({
            id: window.crypto && typeof window.crypto.randomUUID === 'function'
                ? window.crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            productId: customizer.value,
            quantity,
            color: selectedColor.name,
            imprint: imprintInput.value === 'Please advise' ? products[customizer.value].imprint : imprintInput.value,
            speed: speedInput.value
        });
        persistAndRender();
        customizerStatus.textContent = 'Product added to your quote list.';
    });

    clearCartButton.addEventListener('click', () => {
        quoteItems = [];
        persistAndRender();
        quoteStatus.textContent = 'Quote list cleared.';
    });

    quoteForm.addEventListener('submit', async event => {
        event.preventDefault();
        if (!quoteForm.reportValidity()) {
            return;
        }
        if (quoteItems.length === 0) {
            quoteStatus.textContent = 'Add at least one product before requesting a quote.';
            return;
        }
        if (!window.emailjs) {
            quoteStatus.textContent = 'Email service is unavailable. Please try again later or contact us on WhatsApp.';
            return;
        }

        const formData = new FormData(quoteForm);
        const itemSummary = quoteItems.map((item, index) =>
            `${index + 1}. ${products[item.productId].name}; quantity: ${item.quantity}; colour: ${item.color}; branding: ${item.imprint}; production: ${item.speed}`
        ).join('\n');
        const message = [
            'New product quote request from the website.',
            '',
            'Selected products:',
            itemSummary,
            '',
            `Additional details: ${formData.get('deliveryNotes') || 'None provided'}`,
            'Prices and production dates were not shown online; please confirm them with the customer.'
        ].join('\n');

        quoteSubmitButton.disabled = true;
        quoteStatus.textContent = 'Sending your quote request…';
        try {
            await window.emailjs.send(emailJsServiceId, emailJsTemplateId, {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                service: 'Product Quote Request',
                quantity: String(quoteItems.reduce((sum, item) => sum + item.quantity, 0)),
                message
            }, { publicKey: emailJsPublicKey });
            quoteItems = [];
            persistAndRender();
            quoteForm.reset();
            quoteStatus.textContent = 'Your quote request was sent. Our team will contact you to confirm pricing and delivery.';
        } catch (error) {
            console.error('EmailJS product quote request failed:', error);
            quoteStatus.textContent = 'We could not send your quote request. Your selections are saved; please try again or contact us on WhatsApp.';
        } finally {
            quoteSubmitButton.disabled = false;
        }
    });

    updatePreview();
    renderQuoteItems();
}
