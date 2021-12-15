document.addEventListener('DOMContentLoaded', function(){

    modalCourseDetails = document.querySelector('.modal__course-detail');
    modalSignIn = $('.modal__sign-in');
    modalSignUp = $('.modal__sign-up');

    //sign-in clicked
    $('.navbar__btn-sign-in').click(function(){
        modalSignIn.addClass('active');
    });

    //sign-up clicked
    $('.navbar__btn-sign-up').click(function(){
        modalSignUp.addClass('active');
    });

    //switch modal
    $('.btn-switch-modal').click(function(){
        $(this).closest('.modal').removeClass('active');
        if ($(this).closest('.modal').hasClass('modal__sign-in')) 
            modalSignUp.addClass('active');
        if ($(this).closest('.modal').hasClass('modal__sign-up')) 
            modalSignIn.addClass('active');
    })

    //close modal 
    $('.btn-close-modal').click(function(){
        $(this).closest('.modal').removeClass('active');
    });

})