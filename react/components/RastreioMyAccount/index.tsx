import { useState, useEffect } from 'react';

const RastreioMyAccount = () => {
    const [orderId, setOrderId] = useState<string | null>(null);

    // Função para extrair ID do pedido da URL
    const extractOrderId = (hash: string): string | null => {
        const match = hash.match(/\/orders\/([^/?]+)/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        // Verificar URL inicial
        const currentOrderId = extractOrderId(window.location.hash);
        if (currentOrderId) {
            setOrderId(currentOrderId);
        }

        // Escutar mudanças de URL
        const handleHashChange = () => {
            const newOrderId = extractOrderId(window.location.hash);
            setOrderId(newOrderId);
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Injetar iframe quando orderId mudar
    useEffect(() => {
        if (!orderId) {
            return;
        }

        const injectIframe = async () => {
            try {
                // Buscar CPF do cliente
                const res = await fetch('/api/io/safedata/CL/search?_fields=document');
                const data = await res.json();
                const cpf = data[0]?.document || '';

                //console.log('Order ID:', orderId);
                //console.log('CPF:', cpf);

                setTimeout(() => {
                    // Encontrar o elemento onde inserir o iframe
                    const targetElement = document.querySelector('main.vtex-account__page-body .flex.flex-grow-1.w-100.flex-column');

                    if (targetElement) {
                        // Verificar se já existe um iframe para este pedido
                        const existingIframe = targetElement.previousElementSibling as HTMLElement;
                        if (existingIframe?.id === `rastreio-iframe-${orderId}`) {
                            return;
                        }

                        // Criar o iframe
                        const iframe = document.createElement('iframe');
                        iframe.id = `rastreio-iframe-${orderId}`;
                        iframe.src = `https://cliente.universodakota.com.br/#/tracking-embedded?order=${orderId}&client=${cpf}`;
                        iframe.style.width = '100%';
                        iframe.style.border = 'none';
                        iframe.style.minHeight = '400px';
                        iframe.setAttribute('allowFullscreen', '');

                        // Inserir antes do elemento alvo
                        targetElement.parentNode?.insertBefore(iframe, targetElement);
                    }
                }, 3000);
            } catch (err) {
                console.log('ERRO!', err);
            }
        };

        injectIframe();
    }, [orderId]);

    return null;
};

export default RastreioMyAccount;