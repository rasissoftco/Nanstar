//progressive enhancement
if (navigator.serviceWorker) {
    //register sw
    navigator.serviceWorker.register('sw.js').catch(console.error)
}

// add to homescreen alert for ios
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  alert(userAgent);
  return /iphone|ipad|ipod|Mac/.test( userAgent );
}
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

alert("isIos " + isIos() );
alert("!isInStandaloneMode " + !isInStandaloneMode());
if (isIos() && !isInStandaloneMode()) {
  this.setState({ showInstallMessage: true });
}
else
{alert('android');}

var static_data = {
    //base_url: 'http://localhost:50930/api',
    base_url: 'https://nan.ep724.ir/api',
    UniqCode: 'ACC11DF4-E600-4F4D-8716-34BE6768A39F'
};

// Update main page
function GetGeneralFood() {

    // Call general food method
    $.post({
        url: static_data.base_url + '/Rstrnts/GetGeneralFood',
        headers: { UniqCode: static_data.UniqCode, BranchID: 1 /*parseInt(getLocalStorage('BranchID')) */ },
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (request) {
            request.withCredentials = false;
        },
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
                    rstImgData += '<div class="item active"><img style="width:100%;" src="https://nan.ep724.ir/Files/' + rstrntImg[rstImg].Img + '"></div>';
                }
                else {
                    rstImgData += '<div class="item"><img style="width:100%;" src="https://nan.ep724.ir/Files/' + rstrntImg[rstImg].Img + '"></div>';
                }
                rstImgCounter++;
            }
            $('#RstrntImgSlider').replaceWith(rstImgData);

            var bannerSlider = res.bannerSliders;
            var bannerSlideData = '';
            for (var banner in bannerSlider) {
                bannerSlideData += '<a style="color:black" onclick="SetBannerID(' + bannerSlider[banner].BannerSliderID + ')">' +
                    '<img style="margin:5px;border-radius:10px;width:220px;height:120px" src="https://nan.ep724.ir/Files/BannerSlider/' + bannerSlider[banner].ImageName + '"></a>';
            }
            $('#BannerImgSlider').prepend(bannerSlideData);

            var menu = res.mns;
            var menuData = '';
            for (var mn in menu) {
                menuData += '<a style="color:black" onclick="SetMnID(' + menu[mn].MnID + ')"><div class="col-xs-6 col-sm-3" style="float:left;margin:0;padding:0;border:1px solid #ddd">' +
                    '<img class="col-xs-12 img-fluid" style="height:110px !important" src="https://nan.ep724.ir/Files/Menu/' + menu[mn].ImageName + '">' +
                    '<p class="text-center">' + menu[mn].Name + '</p>' +
                    '</div></a>'
            }
            $('#Menu').prepend(menuData);

            var latestTCDY = res.LatestTCDies;
            var latestTcdyData = '';
            for (var latest in latestTCDY) {
                latestTcdyData += '<div class="inner-scroll">' +
                    '<img src="https://nan.ep724.ir/Files/' + latestTCDY[latest].Pic + '" style="width:100%;height:120px" />' +
                    '<p style="overflow:hidden">' + latestTCDY[latest].Cne + '</p>' +
                    '<p style="overflow:hidden">' + numberWithCommas(latestTCDY[latest].Cfe) + res.VahedPool + '</p>';
                if (latestTCDY[latest].CExst == true) {
                  if (IsInCart(latestTCDY[latest].TCDYID) == false){
                    latestTcdyData += '<button onclick="AddToCart(' + latestTCDY[latest].TCDYID +',\'' + latestTCDY[latest].Cne + '\', this)"  class="btn btn-warning btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                  }
                  else {
                    latestTcdyData += '<button onclick="RemoveFromCart(' + latestTCDY[latest].TCDYID +',\'' + latestTCDY[latest].Cne + '\', this)"  class="btn btn-success btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i>حذف از سبد خرید</button>';
                  }
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
                    '<img src="https://nan.ep724.ir/Files/' + bestSellTCDY[best].Pic + '" style="width:100%;height:120px" />' +
                    '<p style="overflow:hidden">' + bestSellTCDY[best].Cne + '</p>' +
                    '<p style="overflow:hidden">' + numberWithCommas(bestSellTCDY[best].Cfe) + res.VahedPool + '</p>';
                if (bestSellTCDY[best].CExst == true) {
                  if (IsInCart(bestSellTCDY[best].TCDYID) == false){
                    bestSellTcdyData += '<button onclick="AddToCart(' + bestSellTCDY[best].TCDYID +',\'' + bestSellTCDY[best].Cne + '\',this)" class="btn btn-warning btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                  }
                  else {
                    {
                      bestSellTcdyData += '<button onclick="RemoveFromCart(' + bestSellTCDY[best].TCDYID +',\'' + bestSellTCDY[best].Cne + '\',this)" class="btn btn-success btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i>حذف از سبد خرید</button>';
                    }
                  }
                }
                else if (bestSellTCDY[best].CExst == false) {
                    bestSellTcdyData += '<button class="btn btn-warning btn-flat btn-block" disabled style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                }
                bestSellTcdyData += '</div>';
            }
            $('#BestSellTCDY').prepend(bestSellTcdyData);

            UpdateShoppingCartIcon();
            HideOverlay();
        })

        // Failure
        .fail(function (xhr, status, error) {
            console.log(xhr);
            console.log(status);
            console.log(error);
            $('.alert').slideDown();
            setTimeout(function () { $('.alert').slideUp() }, 2000);
        })

    // Prevent submission if originates from click
    return false;
}

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
    putLocalStorage('BranchID', /*rstrntID*/1);
}
function SetVahedPool(pool) {
    putLocalStorage('vahedPool', pool);
}
function SetUserID(userID) {
    putLocalStorage('USERID', userID);
}
function SetCurrentRowID(rowID) {
    putLocalStorage('RowID', rowID);
    window.location.href = "ReceiptDetail.html";
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

    $.post({
        url: static_data.base_url + '/TCDies/GetAllTcdiesByMnID',
        headers: { UniqCode: static_data.UniqCode },
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
                    tcdyListData += '<div class="col-xs-6 text-center" style="padding:3px;float:right">' +
                        '<img src="https://nan.ep724.ir/Files/' + tcdyList[latest].Pic + '" style="width:100%;height:120px" />' +
                        '<p style="overflow:hidden">' + tcdyList[latest].Cne + '</p>' +
                        '<p style="overflow:hidden">' + numberWithCommas(tcdyList[latest].Cfe) + getLocalStorage('vahedPool') + '</p>';
                    if (tcdyList[latest].CExst == true) {
                        tcdyListData += '<button onclick="AddToCart(' + tcdyList[latest].TCDYID +',\'' + tcdyList[latest].Cne + '\',this)" class="btn btn-warning btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    else if (tcdyList[latest].CExst == false) {
                        tcdyListData += '<button class="btn btn-warning btn-flat btn-block" disabled style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    tcdyListData += '</div>';
                }
                $('#tcdyList').prepend(tcdyListData);
            }

            UpdateShoppingCartIcon();
            HideOverlay();
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
        url: static_data.base_url + '/TCDies/GetTCDiesByBannerSliderId',
        headers: { UniqCode: static_data.UniqCode, BranchID: parseInt(getLocalStorage('BranchID')) },
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
                    tcdyListData += '<div class="col-xs-6 text-center" style="padding:3px;float:right">' +
                        '<img src="https://nan.ep724.ir/Files/' + tcdyList[latest].Pic + '" style="width:100%;height:120px" />' +
                        '<p style="overflow:hidden">' + tcdyList[latest].Cne + '</p>' +
                        '<p style="overflow:hidden">' + numberWithCommas(tcdyList[latest].Cfe) + getLocalStorage('vahedPool') + '</p>';
                    if (tcdyList[latest].CExst == true) {
                        tcdyListData += '<button onclick="AddToCart(' + tcdyList[latest].TCDYID +',\'' + tcdyList[latest].Cne + '\',this)" class="btn btn-warning btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    else if (tcdyList[latest].CExst == false) {
                        tcdyListData += '<button class="btn btn-warning flat btn-block" disabled style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    tcdyListData += '</div>';
                }
                $('#bannerSliderTcdy').prepend(tcdyListData);
            }

            UpdateShoppingCartIcon();
            HideOverlay();
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
            url: static_data.base_url + '/TCDies/SearchKala',
            headers: { UniqCode: static_data.UniqCode },
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
                        searchListData += '<div class="col-xs-6 text-center" style="padding:3px;float:right">' +
                            '<img src="https://nan.ep724.ir/Files/' + searchList[search].Pic + '" style="width:100%;height:120px" />' +
                            '<p style="overflow:hidden">' + searchList[search].Cne + '</p>' +
                            '<p style="overflow:hidden">' + numberWithCommas(searchList[search].Cfe) + getLocalStorage('vahedPool') + '</p>' +
                            '</div>';
                    }
                    $('#searchList').prepend(searchListData);
                }

                UpdateShoppingCartIcon();
                HideOverlay();
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
        url: static_data.base_url + '/TCDies/GetLatestTCDies',
        headers: { UniqCode: static_data.UniqCode, BranchID: parseInt(getLocalStorage('BranchID')) },
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
                    tcdyListData += '<div class="col-xs-6 text-center" style="padding:3px;float:right">' +
                        '<img src="https://nan.ep724.ir/Files/' + tcdyList[latest].Pic + '" style="width:100%;height:120px" />' +
                        '<p style="overflow:hidden">' + tcdyList[latest].Cne + '</p>' +
                        '<p style="overflow:hidden">' + numberWithCommas(tcdyList[latest].Cfe) + getLocalStorage('vahedPool') + '</p>';
                    if (tcdyList[latest].CExst == true) {
                        tcdyListData += '<button onclick="AddToCart(' + tcdyList[latest].TCDYID +',\'' + tcdyList[latest].Cne + '\',this)" class="btn btn-warning btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    else if (tcdyList[latest].CExst == false) {
                        tcdyListData += '<button class="btn btn-warning flat btn-block" disabled style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    tcdyListData += '</div>';
                }
                $('#LatestTCDY-full').prepend(tcdyListData);
            }

            UpdateShoppingCartIcon();
            HideOverlay();
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
        url: static_data.base_url + '/TCDies/GetBestSellTCDies',
        headers: { UniqCode: static_data.UniqCode, BranchID: parseInt(getLocalStorage('BranchID')) },
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
                    tcdyListData += '<div class="col-xs-6 text-center" style="padding:3px;float:right">' +
                        '<img src="https://nan.ep724.ir/Files/' + tcdyList[latest].Pic + '" style="width:100%;height:120px" />' +
                        '<p style="overflow:hidden">' + tcdyList[latest].Cne + '</p>' +
                        '<p style="overflow:hidden">' + numberWithCommas(tcdyList[latest].Cfe) + getLocalStorage('vahedPool') + '</p>';
                    if (tcdyList[latest].CExst == true) {
                        tcdyListData += '<button onclick="AddToCart(' + tcdyList[latest].TCDYID +',\'' + tcdyList[latest].Cne + '\',this)" class="btn btn-warning btn-flat btn-block" style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    else if (tcdyList[latest].CExst == false) {
                        tcdyListData += '<button class="btn btn-warning flat btn-block" disabled style="color:#000;font-size:10px;border-radius:0px;"><i class="fa fa-shopping-cart" ></i> افزودن به سبد خرید</button>';
                    }
                    tcdyListData += '</div>';
                }
                $('#BestSellTCDY-full').prepend(tcdyListData);
            }
            UpdateShoppingCartIcon();
            HideOverlay();
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
    else {
      window.location.href="Cart.html";
    }
}

function SelectBranchBtnClicked() {
    $.get({
        url: static_data.base_url + '/Rstrnts/GetAllRstrnts',
        headers: { UniqCode: static_data.UniqCode },
        contentType: 'application/ json; charset=utf - 8'
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

function MainMenuBtnClicked(){
  if (localStorage.getItem('USERID') === null || localStorage.getItem('USERID') == 0) {
    $('#login-li').show();
    $('#profile-li').hide();
    $('#myReceipt-li').hide();
    $('#logout-li').hide();
  }
  else {
    $('#login-li').hide();
    $('#profile-li').show();
    $('#myReceipt-li').show();
    $('#logout-li').show();
  }
}

function AddToCart(TCDYID, name, btn) {
    if (localStorage.getItem('USERID') === null) {
        $('#LoginModal').modal('show');
    }
    else {
        $(btn).removeClass("btn-warning");
        $(btn).addClass("btn-success");
        $(btn).html('<i class="fa fa-shopping-cart" ></i>حذف از سبد خرید');
        $('#select-item-count-Modal').modal('show');
        $(btn).attr('onClick', 'RemoveFromCart(' + TCDYID +',\'' + name + '\',this)' );
        UpdateCart(TCDYID, 1);
        $('#select-item-count-name').html(name);
        $('#select-item-count-count').html('1');
        $('#select-item-count-minus').click(function(){ AddingItemCounts(TCDYID, -1)});
        $('#select-item-count-orderCount').empty();
        var orderCountData = '';
        //for (var oc in orderCount) {
            //orderCountData += '<div class="col-xs-2 col-sm-2" style="background-color:#FF8701;border-radius:50px;padding:15px;margin:5px">5</div>'
        //}
        orderCountData += '<div class="col-xs-2 col-sm-2" style="background-color:#FF8701;border-radius:50px;padding:17px;margin:5px" onclick="AddingItemCounts(' + TCDYID + ',5)">5</div>';
        orderCountData += '<div class="col-xs-2 col-sm-2" style="background-color:#FF8701;border-radius:50px;padding:17px;margin:5px" onclick="AddingItemCounts(' + TCDYID + ',4)">4</div>';
        orderCountData += '<div class="col-xs-2 col-sm-2" style="background-color:#FF8701;border-radius:50px;padding:17px;margin:5px" onclick="AddingItemCounts(' + TCDYID + ',3)">3</div>';
        orderCountData += '<div class="col-xs-2 col-sm-2" style="background-color:#FF8701;border-radius:50px;padding:17px;margin:5px" onclick="AddingItemCounts(' + TCDYID + ',2)">2</div>';
        orderCountData += '<div class="col-xs-2 col-sm-2" style="background-color:#FF8701;border-radius:50px;padding:17px;margin:5px" onclick="AddingItemCounts(' + TCDYID + ',1)">1</div>';
        $('#select-item-count-orderCount').prepend(orderCountData);
    }
    UpdateShoppingCartIcon();
}
function UpdateCart(TCDYID, count){
  //درصورت موجود نبودن ابتدا سبد را بساز
  if(localStorage.getItem('cart') === null){
    putLocalStorage('cart',JSON.stringify([]));
  }
  var cart = [];
  cart = JSON.parse(localStorage.getItem('cart') || "[]");
  var cartItem = { id : TCDYID , count : 1 };
  cart.push(cartItem);
  putLocalStorage('cart',JSON.stringify(cart));
  UpdateShoppingCartIcon();
}

function RemoveFromCart(TCDYID, name, btn){
  var cart = [];
  cart = JSON.parse(localStorage.getItem('cart') || "[]");
  var newCart = [];
  for(var item in cart){
    if (cart[item].id != TCDYID)
    {
      var cartItem = { id : cart[item].id , count : cart[item].count };
      newCart.push(cartItem);
    }
  }
  putLocalStorage('cart',JSON.stringify(newCart));

  $(btn).removeClass("btn-success");
  $(btn).addClass("btn-warning");
  $(btn).html('<i class="fa fa-shopping-cart" ></i>افزودن به سبد خرید');
  $(btn).attr('onClick', 'AddToCart(' + TCDYID + ',\'' + name + '\',this)' );

  UpdateShoppingCartIcon();
}

function AddingItemCounts(TCDYID, count){
  var newCount = null;
  var cart = [];
  cart = JSON.parse(localStorage.getItem('cart') || "[]");
  for(var item in cart){
    if (cart[item].id == TCDYID){
      if(count == -1 && cart[item].count == 1){
        newCount = cart[item].count;
        break;
      }
      else {
        cart[item].count += count;
        newCount = cart[item].count;
        break;
      }
    }
  }
  putLocalStorage('cart',JSON.stringify(cart));
  //$('#select-item-count-count').html(newCount);
}
function GetCart(){
  var cart = [];
  cart = JSON.parse(localStorage.getItem('cart') || "[]");
  console.log(cart);
  $("#my-cart-items").empty();
  if (cart != '[]'){
    var CartItemData = '';
    for(var item in cart){
      CartItemData += '<div class="col-xs-12 col-sm-12" style="border:1px solid #eee;margin-bottom:3px;padding:10px">'+
          '<div class="col-xs-12 col-sm-12">'+
            '<span style="float:right">ریشه زعفران یک مثقالی</span>'+
            '<span style="float:left;color:#FF8701"><i class="fa fa-trash-o"></i></span>'+
          '</div>'+
          '<div class="col-xs-12 col-sm-12 text-right">'+
            '<span onclick="AddingItemCounts(' + cart[item].id + ', 1)"><i class="fa fa-plus-circle text-success"></i></span>'+
            '<span style="margin:10px">' + cart[item].count + '</span>'+
            '<span onclick="AddingItemCounts(' + cart[item].id + ', -1)"><i class="fa fa-minus-circle text-danger"></i></span>'+
          '</div>'+
        '</div>';
    }
    $("#my-cart-items").html(CartItemData);
  }
  else {
    $("#my-cart-items").html('<span>سبد خرید شما خالی است</span>');
  }
}
function UpdateShoppingCartIcon(){
  var cart = [];
  cart = JSON.parse(localStorage.getItem('cart') || "[]");
  var cartCount = 0;
  if(cart != '[]'){
    for(var item in cart){
      cartCount += 1;
    }
  }
  $('#lblCartCount').html(cartCount);
}
function IsInCart(TCDYID){
  var result = false;
  var cart = [];
  cart = JSON.parse(localStorage.getItem('cart') || "[]");
  if (cart == '[]'){
    result = false;
  }
  else {
    for (var item in cart){
      if (cart[item].id == TCDYID){
        result = true;
        break;
      }
    }
  }
  return result;
}

function GetProfile(){
  $.post({
      url: static_data.base_url + '/Common/WholeProfileData',
      headers: { UniqCode: static_data.UniqCode , USERID: localStorage.getItem('USERID') },
      //data: JSON.stringify({ "id": localStorage.getItem('USERID') }),
      contentType: 'application/json; charset=utf-8'
  })

      // Success
      .done(function (res) {
          var tcdyList = res.tCDYWithCounts;
          var tcdyListData = '';
          $('#Adrs1').val(res.tPYR.Adrs);
          $('#Adrs2').val(res.tPYR.Adrs2);
          $('#Adrs3').val(res.tPYR.Adrs3);
          $('#Adrs4').val(res.tPYR.Adrs4);
          $('#CrdNumber').val(res.tPYR.CrdNmbr);
          $('#vahedPool').html(localStorage.getItem('vahedPool'));
          $('#Mmdeh').html(res.String1);
          $('#Nmdeh').html(res.Decimal1);

          UpdateShoppingCartIcon();
          HideOverlay();
      })

      // Failure
      .fail(function () {

          $('.alert').slideDown();
          setTimeout(function () { $('.alert').slideUp() }, 2000);
      })

  // Prevent submission if originates from click
  return false;
}
function SaveProfile(){

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
            url: static_data.base_url + '/CntctFrms/PostCntctFrm',
            headers: { UniqCode: static_data.UniqCode, BranchID: parseInt(getLocalStorage('BranchID')) },
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
        url: static_data.base_url + '/Common/SendCode',
        headers: { UniqCode: static_data.UniqCode, BranchID: parseInt(getLocalStorage('BranchID')) },
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

//submit logout form
function SubmitLogouForm(){
  $('#LogoutModal').modal('toggle');
  putLocalStorage('USERID', 0);
}

function SendVerifyCode() {
    var mobile = $.trim($("#login-mobile").val());
    var verifyCode = $.trim($("#login-verifyCode").val());
    console.log(mobile + verifyCode);
    $('#VerifyCodeModal').modal('toggle');

    $.post({
        url: static_data.base_url + '/Common/VerifyCode',
        headers: { UniqCode: static_data.UniqCode, BranchID: parseInt(getLocalStorage('BranchID')) },
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
                }
            }
        })

        // Failure
        .fail(function () {

            $('.alert').slideDown();
            setTimeout(function () { $('.alert').slideUp() }, 2000);
        })
}

function GetMyRecceipts(){
  $.post({
      url: static_data.base_url + '/ReceiptHeaders/MyReceiptHeaders',
      headers: { UniqCode: static_data.UniqCode , USERID : localStorage.getItem('USERID') },
      data: JSON.stringify({ "Int1": localStorage.getItem('USERID') }),
      contentType: 'application/json; charset=utf-8'
  })

      // Success
      .done(function (res) {
        // Empty Element
        $('#receipts-list').empty();
        var receiptHeaders = res.receiptHeaderFullDatas;
        var receiptHeadersData = '';
        for (var rh in receiptHeaders) {
          receiptHeadersData += '<a onclick="SetCurrentRowID(\'' + receiptHeaders[rh].RowID + '\')" style="color:#000;text-decoration:none">'+
            '<div class="col-xs-12 col-sm-12">'+
              '<div class="col-xs-12 col-sm-12" style="background-color:#ffeb99;padding:5px">'+
                '<span class="text-danger">شماره فاکتور: </span><span>' + receiptHeaders[rh].Receipt_no +'</span><span><i class="fa fa-angle-left" style="color:#FF8701;float:left;font-weight:bold"></i></span>'+
              '</div>'+
            '<div class="col-xs-12 col-sm-12" style="padding:5px">'+
              '<div class="col-xs-6 col-sm-6" style="padding:0">'+
                '<p><span class="text-danger">تاریخ: </span><span>' + receiptHeaders[rh].FactorTarikh + '</span></p>'+
                '<p><span class="text-danger">نوع پرداخت: </span><span>آنلاین</span></p>'+
                '<p><span class="text-danger">تخفیف:</span><span> ' + numberWithCommas(receiptHeaders[rh].DiscountAmount) + '</span><span>'+ localStorage.getItem('vahedPool') + '</span></p>'+
              '</div>'+
              '<div class="col-xs-6 col-sm-6" style="padding:0">'+
                '<p><span class="text-danger">وضعیت: </span><span class="label label-danger">لغو شده</span></p>'+
                '<p><span class="text-danger">مبلغ کل: </span><span> ' + numberWithCommas(receiptHeaders[rh].Total_amounts) + '</span><span>' + localStorage.getItem('vahedPool') + '</span></p>'+
                '<p><span class="text-danger">مالیات: </span><span>' + numberWithCommas(receiptHeaders[rh].Total_tax) + '</span><span>' + localStorage.getItem('vahedPool') + ' </span></p>'+
              '</div>'+
              '<div class="col-xs-12 col-sm-12" style="padding:0">'+
                '<p><span class="text-danger">اضافات: </span><span>' + numberWithCommas(receiptHeaders[rh].TotalEzf - receiptHeaders[rh].TotalKsr) + '</span><span>' + localStorage.getItem('vahedPool') + '</span></p>'+
                '<p><span class="text-danger">مبلغ قابل پرداخت: </span><span>'  + numberWithCommas(receiptHeaders[rh].MablaghGhabelPardakht) + '</span><span>'+ localStorage.getItem('vahedPool') + '</span></p>'+
                '<p><span class="text-danger">توضیحات: </span><span>' + receiptHeaders[rh].Tozihat +'</span></p>'+
              '</div>'+
            '</div>'+
            '</div>'+
          '</a>';
        }
        $('#receipts-list').prepend(receiptHeadersData);

          UpdateShoppingCartIcon();
          HideOverlay();
      })

      // Failure
      .fail(function () {

          $('.alert').slideDown();
          setTimeout(function () { $('.alert').slideUp() }, 2000);
      })

  // Prevent submission if originates from click
  return false;
}

function ShowReceiptDetail(){
  $.post({
      url: static_data.base_url + '/ReceiptDetails/FindReceiptDetailsByHeaderID',
      headers: { UniqCode: static_data.UniqCode },
      data: JSON.stringify({ "Int1": localStorage.getItem('RowID') }),
      contentType: 'application/json; charset=utf-8'
  })

      // Success
      .done(function (res) {
        // Empty Element
        $('#ReceiptDetail-ezfksr').empty();
        $('#ReceiptDetail-kala').empty();

        var tEZFKSRs = res.tEZFKSRs;
        var tEZFKSRsData = '';
        for(var ek in tEZFKSRs){
          tEZFKSRsData += '<div class="col-xs-12 col-sm-12" style="border:1px solid #eee;margin-bottom:3px;padding:10px">';
          if(tEZFKSRs[ek].IsEzft == true){
            tEZFKSRsData += '<span><i class="fa fa-plus-circle text-success"></i></span>';
          }
          else if(tEZFKSRs[ek].IsEzft == false){
            tEZFKSRsData += '<span><i class="fa fa-minus-circle text-danger"></i></span>';
          }
            tEZFKSRsData += '<span class="text-danger"> ' + tEZFKSRs[ek].Caption + ': </span>'+
            '<span> ' + numberWithCommas(tEZFKSRs[ek].Price) + ' </span>'+
            '<span> ' + localStorage.getItem('vahedPool') + ' </span>'+
          '</div>';
        }
        $('#ReceiptDetail-ezfksr').prepend(tEZFKSRsData);

        var receiptDetails = res.receiptDetails;
        var receiptDetailsData = '';
        for (var rd in receiptDetails) {
          receiptDetailsData += '<div class="col-xs-12 col-sm-12" style="border:1px solid #eee;margin-bottom:3px;padding:10px">'+
            '<p>' + receiptDetails[rd].Name + '</p>'+
            '<p><span class="text-danger">قیمت: </span><span>' + numberWithCommas(receiptDetails[rd].Price) + '</span><span>' + localStorage.getItem('vahedPool') + '</span></p>'+
            '<p><span class="text-danger">تعداد: </span><span>' + receiptDetails[rd].Weight_quantity + '</span></p>'+
          '</div>';
        }
        $('#ReceiptDetail-kala').prepend(receiptDetailsData);

          UpdateShoppingCartIcon();
          HideOverlay();
          //window.location.href = "ReceiptDetail.html";
      })

      // Failure
      .fail(function () {

          $('.alert').slideDown();
          setTimeout(function () { $('.alert').slideUp() }, 2000);
      })

  // Prevent submission if originates from click
  return false;
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
