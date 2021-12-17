document.addEventListener('DOMContentLoaded', function(){
    //auto fit height text-area
    $("textarea").each(function () {
        this.setAttribute("style", "overflow-y:hidden;");
      }).on("input", function () {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
    });

    //write comment
    $('.btn-comment').click(function(){
        if (!$('textarea[name="comment"]').val()){
            $('.noti-comment').css('display','block');
            return;
        }
        $('.noti-comment').css('display','none');
        $.post(`/courses/show/${$('input[name ="course-id"]').attr('value')}/push-comment`,
            {
                studentId: $('input[name ="student-id"]').attr('value'),
                studentName: $('input[name ="student-name"]').attr('value'),
                comment: $('textarea[name ="comment"]').val(),
            },
            function(res){
                const d = new Date(Date.now());
                $('.course-comments__items-wrapper').append(`
                    <div id="new-comment" class="course-comments__item row">
                        <div class="col-1" style="padding: 0">
                            <div class="course-comments__item-avatar" style="background-image: url(${$('.user_drop-down-avatar').attr('src')});"></div>
                        </div>
                        <div class="col-7">
                            <div class="course-comments__item-content">
                                <div class="course-comments__item-content__name">
                                    ${res.name}
                                </div>
                                <div class="course-comments__item-content__text cmt-${res.commentId}">${res.comment}</div>
                                <input type="text" name="edit-comment" style="display: none;"
                                class="course-comments__item-content__edit edit-cmt-${res.commentId}"/>
                                <div class="noti-warning noti-edit-${res.commentId}" style="display: none;">(*) Invalid comment !!!</div>
                                <div class="course-comments__item-content__time time-cmt-${res.commentId}">
                                    At: ${d.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div class="col-3 d-flex align-items-center ms-auto">
                            <i class="fas fa-pen btn-edit-comment ${res.commentId}" serial="${res.commentId}"></i>
                            <i class="fas fa-trash-alt btn-del-comment ${res.commentId}" serial="${res.commentId}"
                            data-bs-toggle="modal" data-bs-target="#commentConfirmModal"></i>

                            <i class="fas fa-check btn-confirm-edit-comment ${res.commentId}" serial="${res.commentId}" style="display:none;"></i>
                            <i class="fas fa-window-close btn-cancel-edit-comment ${res.commentId}" serial="${res.commentId}" style="display:none;"></i>
                        </div>
                    </div>`);
                $('textarea').val('');
                //scroll
                $('html, body').animate({
                    scrollTop: $("#new-comment").offset().top
                }, 500);
                $('#new-comment').removeAttr('id');
                editBtnComment();
            }
        )
    })

    //edit comment

    editBtnComment = () => {
        //Edit comment
        $('.btn-edit-comment').click(function(){
            const thisSerial = $(this).attr('serial');
            const cmtText = $(`.cmt-${thisSerial}`);
            const editText = $(`.edit-cmt-${thisSerial}`);

            cmtText.css('display', 'none');
            editText.css('display', 'block');
            editText.val(cmtText.html());

            $(this).css('display','none');
            $(`.btn-del-comment.${thisSerial}`).css('display','none');
            $(`.btn-confirm-edit-comment.${thisSerial}`).css('display','block');
            $(`.btn-cancel-edit-comment.${thisSerial}`).css('display','block');
        });

        //Confirm edit comment
        $('.btn-confirm-edit-comment').click(function(){
            const thisSerial = $(this).attr('serial');
            if (!$(`.edit-cmt-${thisSerial}`).val()) $(`.noti-edit-${thisSerial}`).css('display','block');
            else {
                $(`.noti-edit-${thisSerial}`).css('display','none');
                const d = new Date(Date.now());
                const courseId = window.location.href.split('/')[5];

                $.post(`/courses/show/${courseId}/edit-comment`, {
                    commentId: thisSerial,
                    comment: $(`.edit-cmt-${thisSerial}`).val(),
                }, function(res){
                    if (res.success){
                        $(`.cmt-${thisSerial}`).html(res.comment);
                        $(`.time-cmt-${thisSerial}`).val(d.toLocaleString());
                        
                        $(`.btn-cancel-edit-comment.${thisSerial}`).click();
                    }
                    else{
                        alert('Fail!! Something was happened!! Error: ' + err);
                    }
                })
            }
        })

        //Cancel edit comment
        $('.btn-cancel-edit-comment').click(function(){
            const thisSerial = $(this).attr('serial');
            const cmtText = $(`.cmt-${thisSerial}`);
            const editText = $(`.edit-cmt-${thisSerial}`);
            
            cmtText.css('display', 'block');
            editText.css('display', 'none');

            $(`.btn-del-comment.${thisSerial}`).css('display','block');
            $(`.btn-edit-comment.${thisSerial}`).css('display','block');
            $(`.btn-confirm-edit-comment.${thisSerial}`).css('display','none');
            $(this).css('display','none');
        });

        //Delete comment
        $('.btn-del-comment').click(function(){
            const thisSerial = $(this).attr('serial');
            $('#commentConfirmModal .modal-body').html('Continue to delete this comment ?!!');
            $('#commentConfirmModal .modal-title').html('Delete comment');
    
            const commentId = $(this).attr('serial');
    
            $('.btn-confirm-handle-comment').click(function(){
                const courseId = window.location.href.split('/')[5];
                $.post(`/courses/show/${courseId}/delete-comment`, {
                    commentId
                }, function(res){
                    if (res.success){
                        $('.btn-close-confirm-hanlde').click();
                        $(`.course-comments__item-content__text.cmt-${thisSerial}`).parent().parent().parent().remove();
                    }
                })
            })
        })
    }

    editBtnComment();


})