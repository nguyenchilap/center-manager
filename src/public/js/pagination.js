document.addEventListener('DOMContentLoaded', function(){
    //DISPLAY SEQUENTIALLY
    $('.course-item-wrapper').each(function() {
        const delay = $(this).index() * 200 + 'ms';
    
        $(this).css({
            '-webkit-transition-delay': delay,
            '-moz-transition-delay': delay,
            '-o-transition-delay': delay,
            'transition-delay': delay
        });                  
    });


    const MAX_ITEM_PER_PAGE = $('.course-list__pagination').attr('max-item-per-page');
    const courseItemsOriginal = document.querySelectorAll('.course-item-wrapper');

    let btnListPageNum = $('.course-list__pagination .pagination');
    let courseItems = courseItemsOriginal;
    let maxPage = courseItems.length >= MAX_ITEM_PER_PAGE ? Math.ceil(courseItems.length/ MAX_ITEM_PER_PAGE) : 1;

    //LOAD PAGE
    function renderNumPages(){
        btnListPageNum.append(`<li class="page-item disabled"><a class="page-link" href="#courseList">Previous</a></li>
                    <li class="page-item page-number active"><div class="page-link">1</div></li>`);    
        for(let i = 2; i <= maxPage; i++){
            btnListPageNum.append(`<li class="page-item page-number"><div class="page-link">${i}</div></li>`);
        }
        btnListPageNum.append(`<li class="page-item"><a class="page-link" href="#courseList">Next</a></li>`);   
        setClickOnPages();   
        setClickOnNext();
        setClickOnPrev();
    }

    function renderCourses(courseArray){
        $('.course-item-wrapper').removeClass('active');
        const factor = (Number($('.page-number.active').children('.page-link').html()));
        for(let i = 0 + MAX_ITEM_PER_PAGE * (factor - 1) ; (i < MAX_ITEM_PER_PAGE * factor && i < courseArray.length) ; i++){
            courseArray[i].classList.add('active');
        }
    }

    renderNumPages(); 
    renderCourses(courseItems);

    //CHECK IF CANNOT CLICK PREV OR NEXT
    function checkOverPage(){
        if ($('.page-number.active').children().html() == maxPage) 
            $('.course-list__pagination .page-item:last-child').addClass('disabled'); 
        else $('.course-list__pagination .page-item:last-child').removeClass('disabled');
        if ($('.page-number.active').children().html() == '1') 
            $('.course-list__pagination .page-item:first-child').addClass('disabled'); 
        else $('.course-list__pagination .page-item:first-child').removeClass('disabled');
    }
    checkOverPage();

    //SWITCH PAGE => RENDER COURSES FOLLOWING
    function switchPage(numPage){
        $('.page-number.active').removeClass('active');
        $(`.page-number:nth-child(${Number(numPage) + 1})`).addClass('active');
        renderCourses(courseItems);
    }

    //CLICK SPECIFIC PAGE
    function setClickOnPages(){
        $('.page-number').click(function(){
            switchPage($(this).children().html());
            checkOverPage();
        })
    }

    //CLICK NEXT PAGE
    function setClickOnNext(){
        $('.course-list__pagination .page-item:last-child').click(function(){
            const recentPage = $('.page-number.active .page-link').html();
            if (recentPage < maxPage) 
                switchPage(Number(recentPage) + 1);
            checkOverPage();
        })
    }

    //CLICK PREVIOUS PAGE
    function setClickOnPrev(){
        $('.course-list__pagination .page-item:first-child').click(function(){
            const recentPage = $('.page-number.active .page-link').html();
            if (Number(recentPage) > 1) 
                switchPage(Number(recentPage) - 1);
            checkOverPage();
        })
    }

    //COURSES FILTER
    checkKeyInCourseField = (keyword, courseField) => {
        if (courseField.includes(keyword.toUpperCase())){
            return true;
        } 
        return false;
    }

    filterCourse = (courseItems, keywordName, keywordType, keywordLevel) => {
        courseItemsOriginal.forEach(courseItem => {
            const courseName = courseItem.getAttribute('courseName').toUpperCase();
            const courseType = courseItem.getAttribute('courseType').toUpperCase();
            const courseLevel = courseItem.getAttribute('courseLevel').toUpperCase();

            if (checkKeyInCourseField(keywordName, courseName) && checkKeyInCourseField(keywordType, courseType) && checkKeyInCourseField(keywordLevel, courseLevel)){
                courseItems.push(courseItem);
            }
            
        });

        return courseItems;
    }

    renderFilteredCourse = () => {
        $('.course-filter-level-item.active').removeClass('active');
        courseItems = [];
        const keywordName = $('input[type="search"]').val();
        const keywordType = $('.course-filter-type button').html().includes('Loại khóa học') ? '' : $('.course-filter-type button').html();
        const keywordLevel = $('.course-filter-level button').html().includes('Trình độ') ? '' : $('.course-filter-level button').html();

        courseItems = filterCourse(courseItems, keywordName, keywordType, keywordLevel);

        maxPage = courseItems.length >= MAX_ITEM_PER_PAGE ? Math.ceil(courseItems.length/ MAX_ITEM_PER_PAGE) : 1;
        btnListPageNum.html('');
        renderNumPages(); 
        renderCourses(courseItems);
    }

    //COURSE SORT

    getCourseFeatureNum = (courseItem, field) => {
        return Number(courseItem.querySelector(`.features-num-${field}`).innerHTML);
    }

    sortCourse = (field, type) => {
        if (type == 'asc')
            return Array.from(courseItems).sort(function(a, b){
                return getCourseFeatureNum(a, field) - getCourseFeatureNum(b, field);
            })
        else if (type == 'desc'){
            return Array.from(courseItems).sort(function(a, b){
                return getCourseFeatureNum(b, field) - getCourseFeatureNum(a, field);
            })
        }

    }


    handleEvents = () => {
        //SEARCH BY COURSE NAME
        $('input[type="search"]').keyup(function(){
            renderFilteredCourse();
        });
    
        //FILTER LEVEL DROPDOWN
        $('.course-filter-level-item').click(function(){
            $('.course-filter-level-item.active').removeClass('active');      
            $(this).addClass('active');
    
            if ($(this).html() === 'Tất cả'){
                $('.course-filter-level button').html('Trình độ');
            }
            else  $('.course-filter-level button').html($(this).html());
    
            renderFilteredCourse();
        })
    
        //FILTER TYPE DROPDOWN
        $('.course-filter-type-item').click(function(){
            $('.course-filter-type-item.active').removeClass('active');      
            $(this).addClass('active');
    
            if ($(this).html() === 'Tất cả'){
                $('.course-filter-type button').html('Loại khóa học');
            }
            else $('.course-filter-type button').html($(this).html());
            
            renderFilteredCourse();
        })
    
        //SORT
        $('.course-sort-item').click(function(){
            $('.course-sort button').html($(this).html());
            const field = $(this).attr('value');
            const type = $(this).attr('type');

            $.post('/sort-course', {
                field,
                type
            }, function(courses){
                courseItem = courses;
                renderFilteredCourse();
            })
        })
    }

    handleEvents();

})