'use strict';

var numberOfposts = $("#loop .card").length;
var limitPerPage = 12;
$("#loop .card:gt(" + (limitPerPage - 1) + ")").hide();
var totalPages = Math.round(numberOfposts / limitPerPage);
$(".pagination").append("<li class='current-page page-item active'><a class='page-link' href='javascript:void(0)'>" + 1 + "</a></li>");

for(var i = 2; i <= totalPages; i++){
    $(".pagination").append("<li class='current-page page-item'><a class='page-link' href='javascript:void(0)'>" + i + "</a></li>");
}

$(".pagination").append("<li class='page-item' id='next-page'><a class='page-link' href='javascript:void(0)' aria-label='Next'><span aria-hidden='true'>&raquo;</span><span class='sr-only'>Next</span></a></li>");

$(".pagination li.current-page").on("click", function(){
    if ($(this).hasClass("active")){
        return false;
    } else {
        var currentPage = $(this).index();
        $(".pagination li").removeClass("active");
        $(this).addClass("active");
        $("#loop .card").hide();

        var grandTotal = limitPerPage * currentPage;
        for(var i = grandTotal - limitPerPage; i < grandTotal; i++){
            $("#loop .card:eq(" + i + ")").show();
        }
    }
});

$("#next-page").on("click", function(){
    var currentPage = $(".pagination li.active").index();
    if(currentPage === totalPages){
        return false;
    } else {
        currentPage++;
        $(".pagination li").removeClass("active");
        $("#loop .card").hide();

        var grandTotal = limitPerPage * currentPage;
        for(var i = grandTotal - limitPerPage; i < grandTotal; i++){
            $("#loop .card:eq(" + i + ")").show();
        }
        $(".pagination li.current-page:eq(" + (currentPage - 1) + ")").addClass("active");
    }
});

$("#prev-page").on("click", function(){
    var currentPage = $(".pagination li.active").index();
    if(currentPage === 1){
        return false;
    } else {
        currentPage--;
        $(".pagination li").removeClass("active");
        $("#loop .card").hide();

        var grandTotal = limitPerPage * currentPage;
        for(var i = grandTotal - limitPerPage; i < grandTotal; i++){
            $("#loop .card:eq(" + i + ")").show();
        }
        $(".pagination li.current-page:eq(" + (currentPage - 1) + ")").addClass("active");
    }
});