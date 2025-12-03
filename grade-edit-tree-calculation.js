
var submitButton;
var textarea;
var form;
const rePre = new RegExp("(?![\n\r])  {1,}", "g");
const rePost = new RegExp("[\n\r]", "g");
$( document ).ready(function() {
    console.log("Test");
    submitButton = $('input#id_submitbutton');
    textarea = $('textarea#id_calculation');
    form = $(submitButton).closest("form");
    var temp = textarea.val().replace(rePre, "\n$&");
    textarea.val(temp);
    $(form).on('submit', function() {
        textarea.val(textarea.val().replace(rePost, ""));
    });
});