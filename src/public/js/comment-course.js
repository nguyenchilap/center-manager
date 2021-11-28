document.addEventListener('DOMContentLoaded', function(){
    //auto fit height text-area
    $("textarea").each(function () {
        this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
      }).on("input", function () {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
    });

    //write comment
    $('.btn-comment').click(function(){
        $.post(`/courses/show/${$('input[name ="course-id"]').attr('value')}/push-comment`,
            {
                accountId: $('input[name ="account-id"]').attr('value'),
                studentName: $('input[name ="student-name"]').attr('value'),
                comment: $('textarea[name ="comment"]').val(),
            },
            function(res){
                const d = new Date(Date.now());
                $('.course-comments__items-wrapper').append(`
                    <div class="course-comments__item row mb-5">
                        <div class="col-1" style="padding: 0">
                            <div class="course-comments__item-avatar" style="background-image: url(${$('.user_drop-down-avatar').attr('src')});"></div>
                        </div>
                        <div class="col-7">
                            <div class="course-comments__item-content">
                                <div class="course-comments__item-content__name">
                                    ${res.name}
                                </div>
                                <div class="course-comments__item-content__text">
                                    ${res.comment}
                                </div>
                                <div class="course-comments__item-content__time">
                                    At: ${d.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>`);
                $('textarea').val('');
            }
        )
    })

})