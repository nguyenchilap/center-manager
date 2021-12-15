$(document).ready(function(){
    //show Noti Message
    showNotiMessage = (notiMessage) => {
        $('.modal__sign-up').trigger('reset');
        $('.btn-close-modal').click();
        $('.modal-noti-message').css('display', 'block');
        $('.modal-noti-message .modal-body').html(notiMessage);
    }

    //handle sign-in
    $('.modal__sign-in-btn-submit').click(function(e){
        e.preventDefault();
        const inputUsername = $('.modal__sign-in input[name="username"]');
        const inputPassword = $('.modal__sign-in input[name="password"]');
        
        if (!inputUsername.val() || !inputPassword.val()) alert('Nhập đầy đủ thông tin !!!!');
        else {
            $.post('/',{
                username: inputUsername.val(),
                password: inputPassword.val()
            }, function(res){
                if (res.redirect){
                    window.location.href = res.redirect;
                }
                else {
                    if (res.notiMessage.includes('Username')){
                        $('.noti-password-invalid').css('display', 'none');
                        $('.noti-username-invalid').html(res.notiMessage);
                        $('.noti-username-invalid').css('display', 'block');
                    }
                    else {
                        $('.noti-username-invalid').css('display', 'none');
                        $('.noti-password-invalid').html(res.notiMessage);
                        $('.noti-password-invalid').css('display', 'block');
                    }
                    inputPassword.val('');
                }
            });
        } 
    });

    //handle sign-up
    $('#sign-up__user-name').change(function(){
        $.post('/check-username', {
            username: $(this).val()
        }, function(res){
            if (res.exists){
                $('.noti-username-exists').css('display', 'block');
                $('.btn.modal__sign-up-btn-submit').addClass('disabled');
            }
            else {
                $('.noti-username-exists').css('display', 'none');
                $('.btn.modal__sign-up-btn-submit').removeClass('disabled');
            }
        })
    })

    $('input[name="confirm-password"]').change(function(){
        if ($(this).val() === $('.modal__sign-up input[name="password"]').val()) 
        {
            $('.btn.modal__sign-up-btn-submit').removeClass('disabled');
            $('.noti-password-unmatched').css('display', 'none');
        }
        else {
            $('.noti-password-unmatched').css('display', 'block');
            $('.btn.modal__sign-up-btn-submit').addClass('disabled');
        }
    })


    renderNotiInvalidDate = (checkValidDay, checkValidMonth, checkValidYear) => {
        if (!checkValidDay || !checkValidMonth || !checkValidYear){
            $('.noti-date-invalid').css('display', 'block');
            $('.btn.modal__sign-up-btn-submit').addClass('disabled');
        }
        if (checkValidDay && checkValidMonth && checkValidYear){
            $('.noti-date-invalid').css('display', 'none');
            $('.btn.modal__sign-up-btn-submit').removeClass('disabled');
        }
    }

    checkValidDate = () => {
        let checkValidDay = true;
        let checkValidMonth = true;
        let checkValidYear = true;

        const day = Number($('input[name="DOB-day"]').val());
        const month = Number($('input[name="DOB-month"]').val());
        const year = Number($('input[name="DOB-year"]').val());

        //check Day
        if (day <= 0 || day > 31) checkValidDay = false;
        if (![1, 3, 5, 7, 8, 10, 12].includes(month) && day > 30) checkValidDay = false;
        if (month && (month == 2 && day > 29)) checkValidDay = false;
        //check Month
        if (month && (month <= 0 || month > 12)) checkValidMonth = false;
        //check Year
        if (year && (year <= 1950 || year > 2017)) checkValidYear = false;

        renderNotiInvalidDate(checkValidDay, checkValidMonth, checkValidYear);
    }

    $('.date__field').change(function(){
        checkValidDate();
    })

    $('.customize__input-text-sm').change(function(){
        checkValidDate();
    })


    $('.modal__sign-up-btn-submit').click(function(e){
        e.preventDefault();
        $.post('/account/signup', $('.modal__sign-up').serialize(), function(res){
            showNotiMessage(res.notiMessage);
        })
    })



    //handle forgot password
    let otpHandler;

    sendEmail = () => {
        $.post('/send-otp', {
            username: $('input[name="username"]').val()
        }, function(res){
            otpHandler = res.otp;
        })
    }

    $('.btn-open-forgot-password').click(function(){
        if ($(this).html().includes('password')){
            if (!$('input[name="username"]').val()) {
                $('.noti-username-invalid').html('(*) Type your Username first !!!');
                $('.noti-username-invalid').css('display', 'block');
            }
            else{
                $('.modal__sign-in-forgot-password').addClass('active');
                $(this).html("Don't need anymore");
                $('.noti-username-invalid').css('display', 'none');
                
                //send Email
                sendEmail();
            }
        }
        else{
            $('.modal__sign-in-forgot-password').removeClass('active');
            $(this).html("Forgot password ?");
        }
    })

    $('.btn-resend-otp').click(function(){
        //send Email
        sendEmail();
    });

    $('.btn-create-new-password').click(function(){
        const inputOtp = $('input[name="otp"]');
        const inputNewPassword = $('input[name="new-password"]');
        let notiOtp = $('.noti-otp-invalid');
        let notiPassword = $('.noti-new-password-invalid');

        if (!inputOtp.val()) {
            notiOtp.css('display', 'block');
            notiOtp.html('(*) Invalid OTP !!!!');
        }
        else if (!inputNewPassword.val()) {
            notiPassword.css('display', 'block');
            notiPassword.html('(*) Invalid password !!!!');
        }
        else if (inputOtp.val() != otpHandler.toString()){
            notiOtp.css('display', 'block');
            notiOtp.html('(*) Unmatched OTP !!!!');
        } 
        else {
            notiOtp.css('display', 'none');
            notiPassword.css('display', 'none');

            $.post('/change-password', {
                username: $('input[name="username"]').val(),
                password: $('input[name="new-password"]').val()
            }, function(res){
                showNotiMessage(res.notiMessage);
            })
        }
    })
})