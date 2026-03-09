'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const GoogleTranslate = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <div 
                id="google_translate_element" 
                className="glass-card"
                style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    zIndex: 9999,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
            ></div>
            <Script
                id="google-translate-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        function googleTranslateElementInit() {
                            new google.translate.TranslateElement({
                                pageLanguage: 'en',
                                includedLanguages: 'en,hi,mr',
                                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                            }, 'google_translate_element');
                        }
                    `,
                }}
            />
            <Script
                id="google-translate-script"
                strategy="afterInteractive"
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
            />
        </>
    );
};

export default GoogleTranslate;
