function AjaxCall(url, data, successEvent, failureEvent) {
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: successEvent,
        error: failureEvent,
        async: true
    });
}

function onFailure(msg) {
    console.log(msg);
}

function filterByCategory(item) {
    if (item.Category == "sponser") {
        return true;
    }
    return false;
}

function OnlyNonSpecialcharacters(e) { // Alphanumeric only
    //var specialKeys = new Array();
    //specialKeys.push(8); //Backspace
    //specialKeys.push(9); //Tab
    //specialKeys.push(46); //Delete
    //specialKeys.push(32); //space
    //specialKeys.push(36); //Home
    //specialKeys.push(35); //End
    //specialKeys.push(37); //Left
    //specialKeys.push(38); //Up
    //specialKeys.push(39); //Right
    //specialKeys.push(40); //Down
    //var k = (e.which) ? e.which : e.keyCode;
    //if ((k > 47 && k < 58) || (k > 64 && k < 91) || (k > 96 && k < 123) || k == 0 || (specialKeys.indexOf(k) != -1 && e.charCode != e.keyCode)) {
    //    return true;
    //}
    //else {
    //    return false;
    //}

    var k = e.key;
    re = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
    var isSplChar = re.test(k);
    if (isSplChar)
        return false;
    else
        return true;
}


function getParameterByName(name, url) {
    try {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        // return results[2];
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    } catch (e) { return ''; }
}


function getSearchResultTest(text) {

    var searchText = text;

    var url = "/FDRatesUpload/Service/GetAzureSearchDataPR";

     //Live PR
     //var url = 'https://axisbanklivesearch.search.windows.net/indexes/axisbank-web-search-pr/docs?api-version=2016-09-01&api-key=7BEA5F91C25D2484804D77BC82D60644&queryType=simple&searchMode=any&scoringProfile=WeightageAndMagnitude&$top=15&search=' + text + '*&$select=Title,URI,Priority,Category,CTAText,CTAURL,IconForSearch,SearchDescription';
    
    //Live DR
    //var url = 'https://axisbanklivesearch.search.windows.net/indexes/axisbank-web-search-dr/docs?api-version=2016-09-01&api-key=7BEA5F91C25D2484804D77BC82D60644&queryType=simple&searchMode=any&scoringProfile=WeightageAndMagnitude&$top=15&search=' + text + '*&$select=Title,URI,Priority,Category,CTAText,CTAURL,IconForSearch,SearchDescription';


    $.post(url, { "text": text }, function (data) {
        var html = '';


        if (data.value.length > 0) {
            html = getHtmlFromJsonTest(data.value, null);
            $('.lblResult').css("border", "1px solid transparent").css("padding-left", "0");



            $('.lblResult').html(html);
            SearchResultsEvents();
        }
        else {
            $('.lblResult').html("Sorry! We did not find a match.");
            $('.lblResult').css("background", "white");
            $('.lblResult').css("border", "1px solid #000").css("font-size", "14px").css("padding-left", "15px");


        }
        //else {
        //    $.get(url2, function (data1) {
        //        html = getHtmlFromJsonTest(data.value, data1.Suggestions);
        //        $('.lblResult').html(html);
        //        SearchResultsEvents();

        //    });
        //}

    }, 'json');
}

//function getSearchResultTest(text) {

//    var url = "/FDRatesUpload/Service/GetAzureSearchDataDRV2";
//    //var url = "https://axisbanklivesearch.search.windows.net/indexes/axisbank-web-search-pr/docs?api-version=2016-09-01&api-key=7BEA5F91C25D2484804D77BC82D60644&queryType=simple&searchMode=any&scoringProfile=WeightageAndMagnitude&$top=15&search=" + text + "*&$select=Title,URI,Priority,Category,CTAText,CTAURL,IconForSearch,SearchDescription";

//    $.post(url, { "text": text }, function (data) {
//        var html = '';


//        if (data.value.length > 0) {
//            html = getHtmlFromJsonTest(data.value, null);
//            $('.lblResult').css("border", "1px solid transparent").css("padding-left", "0");



//            $('.lblResult').html(html);
//            SearchResultsEvents();
//        }
//        else {
//            $('.lblResult').html("Sorry! We did not find a match.");
//            $('.lblResult').css("background", "white");
//            $('.lblResult').css("border", "1px solid #000").css("font-size", "14px").css("padding-left", "15px");


//        }
//        //else {
//        //    $.get(url2, function (data1) {
//        //        html = getHtmlFromJsonTest(data.value, data1.Suggestions);
//        //        $('.lblResult').html(html);
//        //        SearchResultsEvents();

//        //    });
//        //}

//    }, 'json');
//}

function SearchResultsEvents() {
    var $input = $('input.rating');
    if ($input.length) {
        $input.removeClass('rating-loading').addClass('rating-loading').rating();
    }

    $("#barsearchrating").change(function (e) {
        e.preventDefault();

        var keyword = $(".headsearch1").val();
        var star = $(this).val();
        if (star != "") {
            var params = {};
            params.keyword = keyword;
            params.star = star;
            params = JSON.stringify(params);
            AjaxCall("/AxisWebService.asmx/SetSearchRating", params, function (response) {
                onSetSearchRatingSuccess(response, keyword, star);
            }, onFailure);
        }

    });


}

function getHtmlFromJsonTest(data, data1) {
    var html = "";
    var mandate = (typeof data) == 'string' ? eval('(' + data + ')') : data;

    var datapresent = false;
    if (data.length > 0)
        datapresent = true;
    if (data1 != null) { if (data1.length > 0) { datapresent = true; } }

    if (datapresent) {
        html = html + '<div class="lisearchrating" style="display:none;"><div class="dvgiverating">Give your rating</div><input id="barsearchrating" value="0" type="text" class="rating" data-min="0" data-max="5" data-step="0.5" data-size="xs" title="" /></div>';
        html = html + "<UL class='Search'>";
        //html = html + '<LI class="lisearchrating"><input id="barsearchrating" value="0" type="text" class="rating" data-min="0" data-max="5" data-step="0.5" data-size="xs" title="" /></LI>';

        //var sponserdata = data.filter(filterByCategory);

        for (i = 0; i < data.length; i += 1) {

            if (data[i].URI.indexOf('http://') + data[i].URI.indexOf('https://') == -2) {
                //data[i].URI = 'https://uat.axisbank.com' + data[i].URI;
            }
            var Anchor = data[i].URI;
            var ctahtml = "";
            if (data[i].CTAText != "" && data[i].CTAText != null)
                ctahtml = "<a class='lnkctalink' href='" + data[i].CTAURL + "'><em>" + data[i].CTAText + "</em></a>";

            var iconforsearchhtml = "";
            var searchlinkclass = "";
            if (data[i].IconForSearch != "" && data[i].IconForSearch != null) {
                iconforsearchhtml = "<img class='imgiconforsearch' src='" + data[i].IconForSearch + "' />";
                searchlinkclass = "imgSearchContain";
            }

            var finaltitle = "";

            var result = data[i].Title;
            var search = $(".headsearch1").val().trim();
            var sindex = result.toLowerCase().indexOf(search.toLowerCase())
            var eindex = sindex + search.length;
            if (sindex >= 0)
                finaltitle = result.substr(0, sindex) + '<span class="spnfinaltitle">' + result.substr(sindex, search.length) + '</span>' + result.substr(eindex)
            else
                finaltitle = result;



            //data[i].Title.replace($(".headsearch1").val().trim(), '<span class="spnsearchtitle">' + $(".headsearch1").val().trim() + '</span>');

            var searchdesc = "";
            if (data[i].SearchDescription != "" && data[i].SearchDescription != null && data[i].Category == "sponsored")
                searchdesc = "<span class='spnsearchdesc'>" + data[i].SearchDescription + "</span>";

            html = html + "<LI class='lisearchitem " + data[i].Category + "' ><a class='lnksearchlink " + searchlinkclass + "' href='" + Anchor + "' >" + iconforsearchhtml + "<em>" + finaltitle + "" + searchdesc + "</em></a>" + ctahtml + "</LI>";

        }
        if (data1 != null) {
            for (i = 0; i < data1.length; i += 1) {

                var Anchor = '';
                if ($(".lblResult_new").length > 0)
                    Anchor = '/search?indexCatalogue=axissearch&searchQuery=' + data1[i] + '&wordsMode=0';
                else
                    Anchor = '/search?indexCatalogue=axissearch&searchQuery=' + data1[i] + '&wordsMode=0';
                html = html + "<LI ><a href='" + Anchor + "' ><em>" + data1[i] + "</em> </a></LI>";

            }
        }


        html = html + "</UL>";
        return html;
    }
    else { return ''; }
}

function onSetSearchRatingSuccess(response, keyword, star) {
    if (response.d == "success") {
        $(".lisearchrating").hide();
    }
}

var NavAzureSearchResultscurrentpage = 1;
var NavAzureSearchResultsislastpageselected = false;
var NavAzureSearchResultspagesize = 10;
var NavAzureSearchResultsnavlength = 5;

function BindAzureSearchResults(NavAzureSearchResultscurrentpage, NavAzureSearchResultspagesize) {

    var searchText = getParameterByName('searchQuery');

    var NavAzureSearchResultsskip = (NavAzureSearchResultscurrentpage - 1) * NavAzureSearchResultspagesize;

    //UAT

    var url = "/FDRatesUpload/Service/BindAzureSearchDataDR";

    $.post(url, { "text": searchText, "pagesize": NavAzureSearchResultspagesize, "skip": NavAzureSearchResultsskip}, function (data) {

        //var html = '';
        //var template = '<div><div class=""><div class="ms-srch-item"><div class="ms-srch-item-body">' +
        //             '<h3 class="ms-srch-ellipsis"><a href="LinkUrl" class="ms-srch-item-link">Title</a></h3>' +
        //             '<dd class="ms-srch-item-summary">Description</dd> ' +
        //             '<div class="ms-srch-item-path"><a href="LinkUrl">LinkUrl</a></div>' +
        //             '</div></div></div></div>';
        //for (var i = 0; i < data.value.length; i++) {
        //    if (data.value[i].URI.indexOf('http://') + data.value[i].URI.indexOf('https://') == -2) {
        //        data.value[i].URI = 'https://www.axisbank.com' + data.value[i].URI;
        //    }
        //    html = html + template.replace(/Title/g, data.value[i].Title).replace(/LinkUrl/g, data.value[i].URI).replace(/Description/g, data.value[i].Description);
        //}
        //if (data.value.length > 0) {
        //    $('.azureSearchResults > h4').show();
        //}
        //else { $('.azureSearchResults > h4').hide(); $('#ctl00_Body_C008').attr('class', 'col-lg-12 col-md-12 col-sm-12'); }

        //$('.azureSearchResults .sfsearchResultsWrp.sfsearchReultTitleSnippetUrl').html(html);

        if (data.value.length == 0) {
            var $emptydivboxes = $(
                ""
            );
            $("#dvazuresearchresults").html($emptydivboxes);
            return false;
        }
        $(".dlazuresearchresults").html('');
        for (var i = 0; i < data.value.length; i++) {

            if (data.value[i].URI.indexOf('http://') + data.value[i].URI.indexOf('https://') == -2) {
                //data.value[i].URI = 'https://uat.axisbank.com' + data.value[i].URI;
            }

            var row = $('<div>' +
                '<div class="">' +
                '<div class="ms-srch-item">' +
                '<div class="ms-srch-item-body">' +
                '<h3 class="ms-srch-ellipsis"><a class="ms-srch-item-link" runat="server" href="' + data.value[i].URI + '">' + data.value[i].Title + '</a></h3>' +
                '<div class="ms-srch-item-summary">' + data.value[i].Description + '</div>' +
                '<dd class="ms-srch-item-summary"></dd>' +
                '<div class="ms-srch-item-path"><a runat="server" href="' + data.value[i].URI + '">' + data.value[i].URI + '</a></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');

            $(".dlazuresearchresults").append(row);

        }

        AzureSearchResultsBindNavList(data["@odata.count"], NavAzureSearchResultscurrentpage);


    }, 'json');
}

function AzureSearchResultsBindNavList(TotalNoofRows, NavAzureSearchResultscurrentpage) {

    $("#dvNavAzureSearchResults").empty();

    if (TotalNoofRows > 0) {
        $("#dvNavAzureSearchResults").append(
                                        "<a class='lnkNavAzureSearchResultsPrev' onclick='NavAzureSearchResultsPrevClick(this);' href='javascript:void(0)'>" +
                                            "&laquo;" +
                                        "</a>"
                                    );

        var NoOfPages = Math.ceil(TotalNoofRows / NavAzureSearchResultspagesize);

        for (var i = 0; i < NoOfPages; i++) {
            var liitem = "";
            if ((i + 1) == NavAzureSearchResultscurrentpage) {

                //if it is current page. Make current page active
                liitem = "<a href='javascript:void(0)' onclick='NavAzureSearchResultsClick(this);' class='sf_PagerCurrent lnkNavAzureSearchResults'>" + (i + 1) + "</a>";

                if (NavAzureSearchResultscurrentpage == NoOfPages) {
                    NavAzureSearchResultsislastpageselected = true;
                } else {
                    NavAzureSearchResultsislastpageselected = false;
                }
            } else {
                if (NavAzureSearchResultscurrentpage <= NavAzureSearchResultsnavlength) {
                    //if the page is before initial 5 pages display
                    if ((i + 1) > NavAzureSearchResultsnavlength) {
                        //if the page is above 5 page display. Make them hidden.
                        //liitem = "<li style='display:none;'><a href='' id='liNavMarketEquityTopGainers' >" + (i + 1) + "</a></li>";
                        liitem = "";
                    }
                    else {
                        //if the page is below 5 page display. Make them visible.
                        liitem = "<a href='javascript:void(0)' onclick='NavAzureSearchResultsClick(this);' class='lnkNavAzureSearchResults'>" + (i + 1) + "</a>";
                    }
                }
                else {
                    //if the page is above initial 5 page display
                    if ((NavAzureSearchResultscurrentpage - (i + 1)) >= 0 && (NavAzureSearchResultscurrentpage - (i + 1)) <= (NavAzureSearchResultsnavlength - 1)) {
                        //if the difference between current page and the page lies between 0-4 (pages block to display) then show them
                        liitem = "<a href='javascript:void(0)' onclick='NavAzureSearchResultsClick(this);' class='lnkNavAzureSearchResults'>" + (i + 1) + "</a>";

                    }
                    else {
                        //if the difference between current page and the page does not lies between 0-4 (pages block to display) then hide them
                        //liitem = "<li style='display:none;'><a href='' id='liNavMarketEquityTopGainers' >" + (i + 1) + "</a></li>";
                        liitem = "";
                    }
                }
            }
            if (liitem != "")
                $("#dvNavAzureSearchResults").append(liitem);
        }

        $("#dvNavAzureSearchResults").append(
                                        "<a class='lnkNavAzureSearchResultsNext' onclick='NavAzureSearchResultsNextClick(this);' href='javascript:void(0)' >" +
                                            "&raquo;" +
                                        "</a>"
                                    );
    }

}

function NavAzureSearchResultsClick(ctrl) {

    var pagetogo = $(ctrl).text();

    NavAzureSearchResultscurrentpage = pagetogo;

    BindAzureSearchResults(NavAzureSearchResultscurrentpage, NavAzureSearchResultspagesize);
}

function NavAzureSearchResultsNextClick(ctrl) {


    //Goto Next Page

    var activepage = $("#dvNavAzureSearchResults").find(".sf_PagerCurrent").text();

    var pagetogo = parseInt(activepage) + 1;

    if (NavAzureSearchResultsislastpageselected == true) {
        $(ctrl).find(".sf_PagerCurrent").removeClass(".sf_PagerCurrent");
    } else {
        NavAzureSearchResultscurrentpage = pagetogo;

        BindAzureSearchResults(NavAzureSearchResultscurrentpage, NavAzureSearchResultspagesize);
    }
}

function NavAzureSearchResultsPrevClick(ctrl) {


    //Goto Previous Page

    var activepage = $("#dvNavAzureSearchResults").find(".sf_PagerCurrent").text();

    var pagetogo = parseInt(activepage) - 1;

    if (pagetogo == 0) {
        $(ctrl).find(".sf_PagerCurrent").removeClass(".sf_PagerCurrent");
    } else {
        NavAzureSearchResultscurrentpage = pagetogo;

        BindAzureSearchResults(NavAzureSearchResultscurrentpage, NavAzureSearchResultspagesize);
    }
}

$(document).ready(function () {

    searchUrl = document.location.origin;

    $('.azureSearchResults > h4').hide();

    if ($('.headertopnav').length > 0) {
        $('.headertopnav').html($('.headertopnav').html().replace('headsearch', 'headsearch1').replace('search_butn', 'search_butn11'));

        $('.hiddensearch').html($('.hiddensearch').html().replace('headsearch', 'headsearch1').replace('search_butn', 'search_butn11'));
    }
    //$(".search_butn11").after('<div class="lblResult"> </div> ');
    var searchText = getParameterByName('searchQuery');
    $('.headsearch1').val(searchText);
    //$('.headertopnav .headsearch1').focus();

    if (searchText == '' || searchText == null) {

    }
    else {
        BindAzureSearchResults(NavAzureSearchResultscurrentpage, NavAzureSearchResultspagesize);
    }

    $('.headsearch1, .stickyheadsearch').keypress(function (e) {
        e.stopPropagation();
        $(this).show();
        return OnlyNonSpecialcharacters(e);
    });

    $('.headsearch1').click(function (e) {
        e.stopPropagation();
        $(this).parents('.hiddensearch').show();

    });

    $('.headsearch1, .stickyheadsearch').keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            //e.stopPropagation();
            var h = $(this).parent().find('.lblResult .selected a').attr('href');
            var txt = $(this).parent().find('.lblResult .selected a').text();
            if (h != null && h != '' && h != 'undefined') {
                $('.headsearch1').val(txt);
                location.href = h;
            } else {

                if ($(".lblResult_new").length > 0)
                    location.href = searchUrl + "/search-results?indexCatalogue=axissearch&searchQuery=" + $(this).val() + "&wordsMode=0";
                else
                    location.href = searchUrl + "/search-results?indexCatalogue=axissearch&searchQuery=" + $(this).val() + "&wordsMode=0";
            }

            return false;
        }
        else if (e.keyCode == 40) {
            e.preventDefault();
            var index = $(this).parent().find('.lblResult ul li.selected').index();
            $(this).parent().find('.lblResult ul li.selected').removeClass('selected');
            $(this).parent().find('.lblResult ul li ').eq(index + 1).addClass('selected');
            e.stopPropagation();
            return false;
        }
        else if (e.keyCode == 38) {
            var index = $(this).parent().find('.lblResult ul li.selected').index();
            $(this).parent().find('.lblResult ul li.selected').removeClass('selected');
            $(this).parent().find('.lblResult ul li ').eq(index - 1).addClass('selected');
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    $('.headsearch1, .stickyheadsearch').keyup(function (e) {
        var text = $(this).val();
        if (e.keyCode == 13 || e.keyCode == 40 || e.keyCode == 38) {
            e.preventDefault();
        }
        else if (text.length > 2) {
            // clearTimeout(delayTimer);
            delayTimer = setTimeout(function () {
                getSearchResultTest(text);
                $('.lblResult').css('visibility', 'visible');
                $('.blackoverlay').show();

                if ($(".lblResult_new").length > 0) {
                    $('body').addClass('searchActive01');
                }

            }, 500);
        }
        else {
            // clearTimeout(delayTimer);
            $('.lblResult').html('');
            $('.lblResult').css('visibility', 'hidden');
            $('.blackoverlay').hide();

            if ($(".lblResult_new").length > 0) {
                $('body').removeClass('searchActive01');
            }
        }
    });

    $(".js-colseBtn").click(function (e) {
        e.preventDefault();
        $('body').removeClass('searchActive01');
    });

    $('.search_butn11').click(function () {
        if ($.trim($(this).prev().val()) == "") {
            $(this).prev().focus();
        } else {

            if ($(".lblResult_new").length > 0)
                window.location = "/search-results?indexCatalogue=axissearch&searchQuery=" + encodeURI($(this).prev().val()) + "&wordsMode=0";
            else
                window.location = "/search-results?indexCatalogue=axissearch&searchQuery=" + encodeURI($(this).prev().val()) + "&wordsMode=0";

        }
        return false;
    });

    $(document).on('click', function (event) {
        if ($('.lblResult').css('visibility', 'hidden')) {
            $(".blackoverlay").hide();
        } else {
            $('.blackoverlay').show();
        }
    });

    $(".lnkSmartSearch").click(function (e) {

        $(".headsearch1").val("");

    });

});