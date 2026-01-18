import translate from 'google-translate-api-x';

export async function autoTranslate(text: string, to: 'en' | 'ar' | 'fr') {
    if (!text) return "";
    try {
        const res = await translate(text, { to });
        return res.text;
    } catch (error) {
        console.error(`Translation failed for ${to}:`, error);
        return text; // Fallback to original text
    }
}

export async function translateProductContent(name: string, description: string) {
    const [nameEn, nameAr, descEn, descAr] = await Promise.all([
        autoTranslate(name, 'en'),
        autoTranslate(name, 'ar'),
        autoTranslate(description, 'en'),
        autoTranslate(description, 'ar')
    ]);

    return {
        nameEn,
        nameAr,
        descEn,
        descAr
    };
}
