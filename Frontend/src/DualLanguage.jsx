import React from 'react';

const GoogleTranslate = () => {
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      { pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
      'google_translate_element'
    );
  };

  React.useEffect(() => {
    var addScript = document.createElement('script');
    addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  return (
    <div id="google_translate_element"></div>
  );
}

export default GoogleTranslate;
