document.addEventListener('DOMContentLoaded', function(){
    const MAX_ITEM_PER_PAGE = $('.course-list__pagination').attr('max-item-per-page');
    const courseItemsOriginal = document.querySelectorAll('.course-item-wrapper');
    let btnListPageNum = $('.course-list__pagination .pagination');

    let courseItems = courseItemsOriginal;
    let maxPage = courseItems.length >= MAX_ITEM_PER_PAGE ? Math.ceil(courseItems.length/ MAX_ITEM_PER_PAGE) : 1;

    console.log(courseItems.length >= MAX_ITEM_PER_PAGE, maxPage);
    //LOAD PAGE
    function renderNumPages(){
        btnListPageNum.append(`<li class="page-item disabled"><div class="page-link">Previous</div></li>
                    <li class="page-item page-number active"><div class="page-link">1</div></li>`);    
        for(let i = 2; i <= maxPage; i++){
            btnListPageNum.append(`<li class="page-item page-number"><div class="page-link">${i}</div></li>`);
        }
        btnListPageNum.append(`<li class="page-item"><div class="page-link">Next</div></li>`);                   
    }

    function renderCourses(courseArray){
        $('.course-item-wrapper').removeClass('active');
        const factor = (Number($('.page-number.active').children('.page-link').html()));
        for(let i = 0 + MAX_ITEM_PER_PAGE * (factor - 1) ; (i < MAX_ITEM_PER_PAGE * factor && i < courseItems.length) ; i++){
            courseArray[i].classList.add('active');
        }
    }

    renderNumPages(); 
    renderCourses(courseItems);

    //AFTER LOAD PAGE
    const btnNextPage = $('.course-list__pagination .page-item:last-child');
    const btnPrevPage = $('.course-list__pagination .page-item:first-child');
    
    function checkOverPage(){
        if ($('.page-number.active').children().html() == maxPage) btnNextPage.addClass('disabled'); else btnNextPage.removeClass('disabled');
        if ($('.page-number.active').children().html() == '1') btnPrevPage.addClass('disabled'); else btnPrevPage.removeClass('disabled');
    }
    checkOverPage();

    //SWITCH PAGE => RENDER COURSES FOLLOWING
    function switchPage(numPage){
        $('.page-number.active').removeClass('active');
        $(`.page-number:nth-child(${Number(numPage) + 1})`).addClass('active');
        renderCourses(courseItems);
    }

    //CLICK SPECIFIC PAGE
    $('.page-number').click(function(){
        switchPage($(this).children().html());
        checkOverPage();
    })

    //CLICK NEXT PAGE
    btnNextPage.click(function(){
        const recentPage = $('.page-number.active .page-link').html();
        if (recentPage < maxPage) 
            switchPage(Number(recentPage) + 1);
        checkOverPage();
    })

    //CLICK PREVIOUS PAGE
    btnPrevPage.click(function(){
        const recentPage = $('.page-number.active .page-link').html();
        if (Number(recentPage) > 1) 
            switchPage(Number(recentPage) - 1);
        checkOverPage();
    })

    //COURSES SEARCHING
    filterCourse = (keyword, field) => {
        courseItems = [];
        courseItemsOriginal.forEach(courseItem => {
            const courseName = courseItem.getAttribute(field).toUpperCase();
            if (courseName.includes(keyword.toUpperCase())) courseItems.push(courseItem);
        });
        maxPage = courseItems.length >= MAX_ITEM_PER_PAGE ? (courseItems.length - courseItems.length % MAX_ITEM_PER_PAGE)/MAX_ITEM_PER_PAGE : 1;
        btnListPageNum.html('');
        renderNumPages(); 
        renderCourses(courseItems);
        checkOverPage();
    }

    //SEARCH BY COURSE NAME
    $('input[type="search"]').keyup(function(){
        filterCourse($(this).val(), 'courseName');
    });

    //FILTER LEVEL DROPDOWN
    $('.course-filter-level-item').click(function(){
        $('.course-filter-level-item.active').removeClass('active');      
        $(this).addClass('active');

        if ($(this).html() === 'Tất cả'){
            $('.course-filter-level button').html('Trình độ');
            filterCourse('', 'courseLevel');
        }
        else {
            $('.course-filter-level button').html($(this).html());
            filterCourse($(this).html(), 'courseLevel');
        }
    })

    $('.course-filter-type-item').click(function(){
        $('.course-filter-type-item.active').removeClass('active');      
        $(this).addClass('active');

        if ($(this).html() === 'Tất cả'){
            $('.course-filter-type button').html('Loại khóa học');
            filterCourse('', 'courseType');
        }
        else {
            $('.course-filter-type button').html($(this).html());
            filterCourse($(this).html(), 'courseType');
        }
    })
})