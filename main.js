
// Update trending giphys
function update() {

    // Toggle refresh state
    $('#update .icon').toggleClass('d-none');

    // Call Giphy API
    $.post({
        url: 'http://localhost:50930/api/Rstrnts/GetGeneralFood',
        headers: { UniqCode: 'ACC11DF4-E600-4F4D-8716-34BE6768A39F', BranchID: '1' },
        contentType: 'application/json; charset=utf-8'
    })

        // Success
        .done(function (res) {

            SetVahedPool(res.VahedPool);

            // Empty Element
            $('#giphys').empty();
            $('#RstrntImgSlider').empty();
            $('#BannerImgSlider').empty();
            $('#Menu').empty();
            $('#LatestTCDY').empty();
            $('#BestSellTCDY').empty();

            // for(key in res) {
            // if(res.hasOwnProperty(key)) {
            // var value = res[key];
            // //do something with value;
            // console.log('key: ' + key +' ,value: ' + value);
            // }}

            var rstrntImg = res.RstrntImgs;
            var rstImgData = '';
            var rstImgCounter = 1;
            for (var rstImg in rstrntImg) {
                if (rstImgCounter == 1) {
                    rstImgData += '<div class="item active"><img style="width:100%;" src="http://nsp.nanstar.ir/Files/' + rstrntImg[rstImg].Img + '"></div>';
                }
                else {
                    rstImgData += '<div class="item"><img style="width:100%;" src="http://nsp.nanstar.ir/Files/' + rstrntImg[rstImg].Img + '"></div>';
                }
                rstImgCounter++;
            }
            $('#RstrntImgSlider').replaceWith(rstImgData);

            var bannerSlider = res.bannerSliders;
            var bannerSlideData = '';
            for (var banner in bannerSlider) {
                bannerSlideData += '<a style="color:black" onclick="SetBannerID(' + bannerSlider[banner].BannerSliderID + ')">' +
                    '<img style="margin:5px;border-radius:10px" src="http://nsp.nanstar.ir/Files/BannerSlider/' + bannerSlider[banner].ImageName + '"></a>';
            }
            $('#BannerImgSlider').prepend(bannerSlideData);

            var menu = res.mns;
            var menuData = '';
            for (var mn in menu) {
                menuData += '<a style="color:black" onclick="SetMnID(' + menu[mn].MnID + ')"><div class="col-xs-6 col-sm-3" style="float:left;margin:0;padding:0;border:1px solid #ddd">' +
                    '<img class="col-xs-12 img-fluid" style="height:110px !important" src="http://nsp.nanstar.ir/Files/Menu/' + menu[mn].ImageName + '">' +
                    '<p class="text-center">' + menu[mn].Name + '</p>' +
                    '</div></a>'
            }
            $('#Menu').prepend(menuData);

            var latestTCDY = res.LatestTCDies;
            var latestTcdyData = '';
            for (var latest in latestTCDY) {
                latestTcdyData += '<div class="inner-scroll">' +
                    '<img src="http://nsp.nanstar.ir/Files/' + latestTCDY[latest].Pic + '" style="width:100%;height:120px" />' +
                    '<p style="overflow:hidden">' + latestTCDY[latest].Cne + '</p>' +
                    '<p style="overflow:hidden">' + numberWithCommas(latestTCDY[latest].Cfe) + res.VahedPool + '</p>';
                if (latestTCDY[latest].CExst == true) {
                    latestTcdyData += '<button onclick="AddToCart(' + latestTCDY[latest].TCDYID + ')"  class="btn btn-warning btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                }
                else if (latestTCDY[latest].CExst == false) {
                    latestTcdyData += '<button class="btn btn-warning btn-flat btn-block" disabled style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                }
                latestTcdyData += '</div>';
            }
            $('#LatestTCDY').prepend(latestTcdyData);

            var bestSellTCDY = res.BestSellTCDies;
            var bestSellTcdyData = '';
            for (var best in bestSellTCDY) {
                bestSellTcdyData += '<div class="inner-scroll">' +
                    '<img src="http://nsp.nanstar.ir/Files/' + bestSellTCDY[best].Pic + '" style="width:100%;height:120px" />' +
                    '<p style="overflow:hidden">' + bestSellTCDY[best].Cne + '</p>' +
                    '<p style="overflow:hidden">' + numberWithCommas(bestSellTCDY[best].Cfe) + res.VahedPool + '</p>';
                if (bestSellTCDY[best].CExst == true) {
                    bestSellTcdyData += '<button onclick="AddToCart(' + bestSellTCDY[best].TCDYID + ')" class="btn btn-warning btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                }
                else if (bestSellTCDY[best].CExst == false) {
                    bestSellTcdyData += '<button class="btn btn-warning btn-flat btn-block" disabled style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                }
                bestSellTcdyData += '</div>';
            }
            $('#BestSellTCDY').prepend(bestSellTcdyData);

            HideOverlay();
            // Loop Giphys
            //$.each( res, function (i, giphy) {

            // Add Giphy HTML
            // $('#giphys').prepend(
            // '<div class="col-sm-6 col-md-4 col-lg-3">' +
            //'<img class="w-100 img-fluid" src="' + giphy.images.downsized_large.url + '">' 				
            // '</div>'
            // );

            //});
        })

        // Failure
        .fail(function () {

            $('.alert').slideDown();
            setTimeout(function () { $('.alert').slideUp() }, 2000);
        })

        // Complete
        .always(function () {

            // Re-Toggle refresh state
            $('#update .icon').toggleClass('d-none');
        });

    // Prevent submission if originates from click
    return false;
}

// Manual refresh
$('#update a').click(update);

// Update trending giphys on load
update();

function numberWithCommas(x) {
    if (x != null) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    else if (x == null) {
        return x;
    }
}

function SetMnID(menuID) {
    putLocalStorage('mnID', menuID);
    window.location.href = "tcdyList.html";
}

function SetBannerID(bannerID) {
    putLocalStorage('bannerID', bannerID);
    window.location.href = "bannerSliderTcdy.html";
}

function SetActiveRstrntID(rstrntID) {
    putLocalStorage('BranchID', rstrntID);
}

function SetVahedPool(pool) {
    putLocalStorage('vahedPool', pool);
}

function SetUserID(userID) {
    putLocalStorage('USERID', userID);
}

function putLocalStorage(key, value) {
    if (window.localStorage) {
        window.localStorage[key] = value;
    }
}
function getLocalStorage(key) {
    return window.localStorage ? window.localStorage[key] : null;
}

// tcdy in menu item
function GetAllTcdiesByMnID() {

    // Call Giphy API
    $.post({
        url: 'http://localhost:50930/api/TCDies/GetAllTcdiesByMnID',
        headers: { UniqCode: 'ACC11DF4-E600-4F4D-8716-34BE6768A39F' },
        data: JSON.stringify({ "Int1": 1, "Int2": parseInt(getLocalStorage('mnID')) }),
        contentType: 'application/json; charset=utf-8'
    })

        // Success
        .done(function (res) {

            // Empty Element
            $('#tcdyList').empty();

            if (res.tCDYWithCounts.length == 0) {
                $('#empty-alert').slideDown();
            }
            else {
                var tcdyList = res.tCDYWithCounts;
                var tcdyListData = '';
                for (var latest in tcdyList) {
                    tcdyListData += '<div class="col-xs-6 text-center" style="padding:3px">' +
                        '<img src="http://nsp.nanstar.ir/Files/' + tcdyList[latest].Pic + '" style="width:100%;height:120px" />' +
                        '<p style="overflow:hidden">' + tcdyList[latest].Cne + '</p>' +
                        '<p style="overflow:hidden">' + numberWithCommas(tcdyList[latest].Cfe) + getLocalStorage('vahedPool') + '</p>';
                    if (tcdyList[latest].CExst == true) {
                        tcdyListData += '<button onclick="AddToCart(' + tcdyList[latest].TCDYID + ')" class="btn btn-warning btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    else if (tcdyList[latest].CExst == false) {
                        tcdyListData += '<button class="btn btn-warning btn-flat btn-block" disabled style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    tcdyListData += '</div>';
                }
                $('#tcdyList').prepend(tcdyListData);
            }

            HideOverlay()
        })

        // Failure
        .fail(function () {

            $('.alert').slideDown();
            setTimeout(function () { $('.alert').slideUp() }, 2000);
        })

    // Prevent submission if originates from click
    return false;
}


// tcdy in banner slider item
function GetTCDiesByBannerSliderId() {

    // Call Giphy API
    $.post({
        url: 'http://localhost:50930/api/TCDies/GetTCDiesByBannerSliderId',
        headers: { UniqCode: 'ACC11DF4-E600-4F4D-8716-34BE6768A39F', BranchID: '1' },
        data: JSON.stringify({ "Int1": 1, "Int2": parseInt(getLocalStorage('bannerID')) }),
        contentType: 'application/json; charset=utf-8'
    })

        // Success
        .done(function (res) {

            // Empty Element
            $('#bannerSliderTcdy').empty();

            if (res.tCDYWithCounts.length == 0) {
                $('#empty-alert').slideDown();
            }
            else {
                var tcdyList = res.tCDYWithCounts;
                var tcdyListData = '';
                for (var latest in tcdyList) {
                    tcdyListData += '<div class="col-xs-6 text-center" style="padding:3px">' +
                        '<img src="http://nsp.nanstar.ir/Files/' + tcdyList[latest].Pic + '" style="width:100%;height:120px" />' +
                        '<p style="overflow:hidden">' + tcdyList[latest].Cne + '</p>' +
                        '<p style="overflow:hidden">' + numberWithCommas(tcdyList[latest].Cfe) + getLocalStorage('vahedPool') + '</p>';
                    if (tcdyList[latest].CExst == true) {
                        tcdyListData += '<button onclick="AddToCart(' + tcdyList[latest].TCDYID + ')" class="btn btn-warning btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    else if (tcdyList[latest].CExst == false) {
                        tcdyListData += '<button class="btn btn-warning flat btn-block" disabled style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    tcdyListData += '</div>';
                }
                $('#bannerSliderTcdy').prepend(tcdyListData);
            }

            HideOverlay()
        })

        // Failure
        .fail(function () {

            $('.alert').slideDown();
            setTimeout(function () { $('.alert').slideUp() }, 2000);
        })

    // Prevent submission if originates from click
    return false;
}

$('#SearchInput').keyup(function () {

    if ($.trim($('#SearchInput').val()) == '') {
        $('#empty-alert').html('حداقل یک حرف وارد کنید.');
        $('#empty-alert').slideDown();
        $('#searchList').empty();
    }
    else {
        // Call Giphy API
        $.post({
            url: 'http://localhost:50930/api/TCDies/SearchKala',
            headers: { UniqCode: 'ACC11DF4-E600-4F4D-8716-34BE6768A39F' },
            data: JSON.stringify({ "Int1": 1, "String1": $.trim($('#SearchInput').val()) }),
            contentType: 'application/json; charset=utf-8'
        })

            // Success
            .done(function (res) {

                // Empty Element
                $('#searchList').empty();
                $('#empty-alert').hide();

                if (res.tCDYWithCounts.length == 0) {
                    $('#empty-alert').slideDown();
                }
                else {
                    var searchList = res.tCDYWithCounts;
                    var searchListData = '';
                    for (var search in searchList) {
                        searchListData += '<div class="col-xs-6 text-center" style="padding:3px">' +
                            '<img src="http://nsp.nanstar.ir/Files/' + searchList[search].Pic + '" style="width:100%;height:120px" />' +
                            '<p style="overflow:hidden">' + searchList[search].Cne + '</p>' +
                            '<p style="overflow:hidden">' + numberWithCommas(searchList[search].Cfe) + getLocalStorage('vahedPool') + '</p>' +
                            '</div>';
                    }
                    $('#searchList').prepend(searchListData);
                }

                HideOverlay()
            })

            // Failure
            .fail(function () {

                $('.alert').slideDown();
                setTimeout(function () { $('.alert').slideUp() }, 2000);
            })

    }

    // Prevent submission if originates from click
    return false;

});


// latest tcdy
function GetLatestTCDies() {

    $.post({
        url: 'http://localhost:50930/api/TCDies/GetLatestTCDies',
        headers: { UniqCode: 'ACC11DF4-E600-4F4D-8716-34BE6768A39F', BranchID: '1' },
        data: JSON.stringify({ "Int1": 1 }),
        contentType: 'application/json; charset=utf-8'
    })

        // Success
        .done(function (res) {

            // Empty Element
            $('#LatestTCDY-full').empty();

            if (res.tCDYWithCounts.length == 0) {
                $('#empty-alert').slideDown();
            }
            else {
                var tcdyList = res.tCDYWithCounts;
                var tcdyListData = '';
                for (var latest in tcdyList) {
                    tcdyListData += '<div class="col-xs-6 text-center" style="padding:3px">' +
                        '<img src="http://nsp.nanstar.ir/Files/' + tcdyList[latest].Pic + '" style="width:100%;height:120px" />' +
                        '<p style="overflow:hidden">' + tcdyList[latest].Cne + '</p>' +
                        '<p style="overflow:hidden">' + numberWithCommas(tcdyList[latest].Cfe) + getLocalStorage('vahedPool') + '</p>';
                    if (tcdyList[latest].CExst == true) {
                        tcdyListData += '<button onclick="AddToCart(' + tcdyList[latest].TCDYID + ')" class="btn btn-warning btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    else if (tcdyList[latest].CExst == false) {
                        tcdyListData += '<button class="btn btn-warning flat btn-block" disabled style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    tcdyListData += '</div>';
                }
                $('#LatestTCDY-full').prepend(tcdyListData);
            }

            HideOverlay()
        })

        // Failure
        .fail(function () {

            $('.alert').slideDown();
            setTimeout(function () { $('.alert').slideUp() }, 2000);
        })

    // Prevent submission if originates from click
    return false;
}

// best sell tcdy
function GetBestSellTCDies() {

    // Call Giphy API
    $.post({
        url: 'http://localhost:50930/api/TCDies/GetBestSellTCDies',
        headers: { UniqCode: 'ACC11DF4-E600-4F4D-8716-34BE6768A39F', BranchID: '1' },
        data: JSON.stringify({ "Int1": 1 }),
        contentType: 'application/json; charset=utf-8'
    })

        // Success
        .done(function (res) {

            // Empty Element
            $('#BestSellTCDY-full').empty();

            if (res.tCDYWithCounts.length == 0) {
                $('#empty-alert').slideDown();
            }
            else {
                var tcdyList = res.tCDYWithCounts;
                var tcdyListData = '';
                for (var latest in tcdyList) {
                    tcdyListData += '<div class="col-xs-6 text-center" style="padding:3px">' +
                        '<img src="http://nsp.nanstar.ir/Files/' + tcdyList[latest].Pic + '" style="width:100%;height:120px" />' +
                        '<p style="overflow:hidden">' + tcdyList[latest].Cne + '</p>' +
                        '<p style="overflow:hidden">' + numberWithCommas(tcdyList[latest].Cfe) + getLocalStorage('vahedPool') + '</p>';
                    if (tcdyList[latest].CExst == true) {
                        tcdyListData += '<button onclick="AddToCart(' + tcdyList[latest].TCDYID + ')" class="btn btn-warning btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    else if (tcdyList[latest].CExst == false) {
                        tcdyListData += '<button class="btn btn-warning flat btn-block" disabled style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    tcdyListData += '</div>';
                }
                $('#BestSellTCDY-full').prepend(tcdyListData);
            }

            HideOverlay()
        })

        // Failure
        .fail(function () {

            $('.alert').slideDown();
            setTimeout(function () { $('.alert').slideUp() }, 2000);
        })

    // Prevent submission if originates from click
    return false;
}

// $("#ShoppingCartIcon").click(function(){ 
// console.log('open modal'); 
// if (localStorage.getItem('USERID') === null) {
// console.log('open modal');
// $('#LoginModal').modal('show');
// $('#LoginModal-container').show();
// }
// })

function ShoppingCartIconClicked() {
    if (localStorage.getItem('USERID') === null) {
        $('#LoginModal').modal('show');
    }
}

function SelectBranchBtnClicked() {
    $.get({
        url: 'http://localhost:50930/api/Rstrnts/GetAllRstrnts', headers: { UniqCode: 'ACC11DF4-E600-4F4D-8716-34BE6768A39F' }, contentType: 'application/json; charset=utf-8'
    })

        // Success
        .done(function (res) {

            // Empty Element
            $('#RstrntList').empty();

            var rstrnts = res.rstrnts;
            console.log(rstrnts);
            var RstrntListData = '';
            var ActiveRstrntID = 0;
            for (var rst in rstrnts) {
                if (ActiveRstrntID == 0) {
                    if (rstrnts[rst].OpenClose == true) {
                        RstrntListData += '<a onclick="SetActiveRstrntID(' + rstrnts[rst].RstrntID + ')" style="color:#000" ><div class="col-xs-12 col-sm-12" style="border:1px solid #eee;margin-bottom:3px;padding:10px;border-left:5px solid #FF8701">';
                        ActiveRstrntID = rstrnts[rst].RstrntID;
                        RstrntListData += '<p><span class="text-warning">نام: </span>';
                        if (rstrnts[rst].OpenClose == true) {
                            RstrntListData += '<span class="label label-success" style="float:left">باز</span>';
                        }
                        else if (rstrnts[rst].OpenClose == false) {
                            RstrntListData += '<span class="label label-danger" style="float:left">بسته</span>';
                        }
                        RstrntListData += '<span>' + rstrnts[rst].Nm + '</span></p>' +
                            '<p><span class="text-warning">شماره تماس: </span><span>' + rstrnts[rst].PhnNm1 + '</span><span> - </span><span>' + rstrnts[rst].PhnNm2 + '</span></p>' +
                            '<p><span class="text-warning">آدرس: </span><span>' + rstrnts[rst].Adrs + '</span></p>' +
                            '</div></a>';
                    }
                    else if (rstrnts[rst].OpenClose == false) {
                        RstrntListData += '<div class="col-xs-12 col-sm-12" style="border:1px solid #eee;margin-bottom:3px;padding:10px;">';
                        RstrntListData += '<p><span class="text-warning">نام: </span>';
                        if (rstrnts[rst].OpenClose == true) {
                            RstrntListData += '<span class="label label-success" style="float:left">باز</span>';
                        }
                        else if (rstrnts[rst].OpenClose == false) {
                            RstrntListData += '<span class="label label-danger" style="float:left">بسته</span>';
                        }
                        RstrntListData += '<span>' + rstrnts[rst].Nm + '</span></p>' +
                            '<p><span class="text-warning">شماره تماس: </span><span>' + rstrnts[rst].PhnNm1 + '</span><span> - </span><span>' + rstrnts[rst].PhnNm2 + '</span></p>' +
                            '<p><span class="text-warning">آدرس: </span><span>' + rstrnts[rst].Adrs + '</span></p>' +
                            '</div>';
                    }
                }
                else if (ActiveRstrntID != 0) {
                    if (rstrnts[rst].OpenClose == true) {
                        RstrntListData += '<a onclick="SetActiveRstrntID(' + rstrnts[rst].RstrntID + ')" style="color:#000" ><div class="col-xs-12 col-sm-12" style="border:1px solid #eee;margin-bottom:3px;padding:10px;">';
                        RstrntListData += '<p><span class="text-warning">نام: </span>';
                        if (rstrnts[rst].OpenClose == true) {
                            RstrntListData += '<span class="label label-success" style="float:left">باز</span>';
                        }
                        else if (rstrnts[rst].OpenClose == false) {
                            RstrntListData += '<span class="label label-danger" style="float:left">بسته</span>';
                        }
                        RstrntListData += '<span>' + rstrnts[rst].Nm + '</span></p>' +
                            '<p><span class="text-warning">شماره تماس: </span><span>' + rstrnts[rst].PhnNm1 + '</span><span> - </span><span>' + rstrnts[rst].PhnNm2 + '</span></p>' +
                            '<p><span class="text-warning">آدرس: </span><span>' + rstrnts[rst].Adrs + '</span></p>' +
                            '</div></a>';
                    }
                    else if (rstrnts[rst].OpenClose == false) {
                        RstrntListData += '<div class="col-xs-12 col-sm-12" style="border:1px solid #eee;margin-bottom:3px;padding:10px;">';
                        RstrntListData += '<p><span class="text-warning">نام: </span>';
                        if (rstrnts[rst].OpenClose == true) {
                            RstrntListData += '<span class="label label-success" style="float:left">باز</span>';
                        }
                        else if (rstrnts[rst].OpenClose == false) {
                            RstrntListData += '<span class="label label-danger" style="float:left">بسته</span>';
                        }
                        RstrntListData += '<span>' + rstrnts[rst].Nm + '</span></p>' +
                            '<p><span class="text-warning">شماره تماس: </span><span>' + rstrnts[rst].PhnNm1 + '</span><span> - </span><span>' + rstrnts[rst].PhnNm2 + '</span></p>' +
                            '<p><span class="text-warning">آدرس: </span><span>' + rstrnts[rst].Adrs + '</span></p>' +
                            '</div>';
                    }
                }

            }
            $('#RstrntList').prepend(RstrntListData);
        })

        // Failure
        .fail(function () {

            $('.alert').slideDown();
            setTimeout(function () { $('.alert').slideUp() }, 2000);
        })

        // Complete
        .always(function () {

            // Re-Toggle refresh state
            $('#update .icon').toggleClass('d-none');
        });

    // Prevent submission if originates from click
    return false;

}

function AddToCart(TCDYID) {
    if (localStorage.getItem('USERID') === null) {
        $('#LoginModal').modal('show');
    }
    else {
        console.log("this will add to cart: " + TCDYID);
    }
}

//submit contact form
$("#ContactFormBtn").click(function () {
    var name = $.trim($("#ContactForm-Name").val());
    var textMsg = $.trim($("#ContactForm-ContactText").val());
    if (name == '' || textMsg == '') { 
        $('#empty-alert').slideDown();
        $('#empty-alert').html('نام و پیام وارد کنید');
    }
    else {
        $.post({
            url: 'http://localhost:50930/api/CntctFrms/PostCntctFrm',
            headers: { UniqCode: 'ACC11DF4-E600-4F4D-8716-34BE6768A39F', BranchID: '1' },
            data: JSON.stringify({ "Name": name, "Message": textMsg }),
            contentType: 'application/json; charset=utf-8'
        })

            // Success
            .done(function (res) {
                console.log('message sent successfully!');
            })

            // Failure
            .fail(function () {

                $('.alert').slideDown();
                setTimeout(function () { $('.alert').slideUp() }, 2000);
            })
    }
});

//submit login form
function SubmitLoginForm() {
    var mobile = $.trim($("#login-mobile").val());
    $('#LoginModal').modal('toggle');
    $('#VerifyCodeModal').modal('toggle');

    $.post({
        url: 'http://localhost:50930/api/Common/SendCode',
        headers: { UniqCode: 'ACC11DF4-E600-4F4D-8716-34BE6768A39F', BranchID: '1' },
        data: JSON.stringify({ "String1": mobile }),
        contentType: 'application/json; charset=utf-8'
    })

        // Success
        .done(function (res) {
            console.log(res.errorCode + " " + res.errorMessage);
        })

        // Failure
        .fail(function () {

            $('.alert').slideDown();
            setTimeout(function () { $('.alert').slideUp() }, 2000);
        })
}

function SendVerifyCode() {
    var mobile = $.trim($("#login-mobile").val());
    var verifyCode = $.trim($("#login-verifyCode").val());
    console.log(mobile + verifyCode);
    $('#VerifyCodeModal').modal('toggle');

    $.post({
        url: 'http://localhost:50930/api/Common/VerifyCode',
        headers: { UniqCode: 'ACC11DF4-E600-4F4D-8716-34BE6768A39F', BranchID: '1' },
        data: JSON.stringify({ "String1": mobile, "String2": verifyCode }),
        contentType: 'application/json; charset=utf-8'
    })

        // Success
        .done(function (res) {
            console.log(res.TPYRID + " " + res.PsttD);
            if (res != null) {
                if (res.PsttD != 7) {
                    alert("حساب کابری شما فعال نیست!");
                }
                else {
                    SetUserID(res.TPYRID);
                    alert("ورود با موفقیت انجام شد.");
                }
            }
        })

        // Failure
        .fail(function () {

            $('.alert').slideDown();
            setTimeout(function () { $('.alert').slideUp() }, 2000);
        })
}

function HideOverlay() {
    $('#overlay-container').fadeOut();
}

//loading theme

// (function(){
  // function id(v){ return document.getElementById(v); }
  // function loadbar() {
    // var ovrl = id("overlay"),
        // prog = id("progress"),
        // stat = id("progstat"),
        // img = document.images,
        // c = 0,
        // tot = img.length;
    // if(tot == 0) return doneLoading();

    // function imgLoaded(){
      // c += 1;
      // var perc = ((100/tot*c) << 0) +"%";
      // prog.style.width = perc;
      // stat.innerHTML = "Loading "+ perc;
      // if(c===tot) return doneLoading();
    // }
    // function doneLoading(){
      // ovrl.style.opacity = 0;
      // setTimeout(function(){ 
        // ovrl.style.display = "none";
      // }, 2200);
    // }
    // for(var i=0; i<tot; i++) {
      // var tImg     = new Image();
      // tImg.onload  = imgLoaded;
      // tImg.onerror = imgLoaded;
      // tImg.src     = img[i].src;
    // }    
  // }
  // document.addEventListener('DOMContentLoaded', loadbar, false);
// }());