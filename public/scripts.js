var phoneMask = ['+', /[1-9]/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]

 // Assuming you have an input element in your HTML with the class .myInput 
 var myInput = document.querySelector('#mobile-input')

 var maskedInputController = vanillaTextMask.maskInput({
   inputElement: myInput,
   mask: phoneMask
 })