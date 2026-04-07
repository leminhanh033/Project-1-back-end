const initmce = (id="") => {
    tinymce.init({
        selector: id||"[textarea-mce]",
        plugins: 'charmap image',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat|charmap| image',
        quickbars_insert_toolbar: 'quickimage quicktable',
    });
};
initmce();