var zbozi;
var kategorie;
var kosik =[];
var kosikSoucetCeny = 0;
var objednavka ="";
var appPreffix = "svaca/";

$(document).ready(function(){

    nactiData();

    $("#pages a").click(function(e){
        //if(e.target.hash.slice(1)=="") console.log("nic");
        e.preventDefault();
        if(e.target.hash == null) return;
        var nextPage = $(e.target.hash);
        if(e.target.hash.slice(1)!="") {
            transition(nextPage, 'fade');
            //console.log(e.target.hash.slice(1));
            $("#pages").attr("className", e.target.hash.slice(1));
        }


    });





});



function transition(toPage, type) {

    $('#menuLeftDiv').css('display','none');
    var toPage = $(toPage),
        fromPage = $("#pages .current");

    if(toPage.hasClass("current") || toPage === fromPage) {
        return;
    };

    toPage
        .addClass("current " + type + " in")
        .one("webkitAnimationEnd", function(){
            fromPage.removeClass("current " + type + " out");
            toPage.removeClass(type + " in")
        });
    fromPage.addClass(type + " out");

    if(!("WebKitTransitionEvent" in window)){
        toPage.addClass("current");
        fromPage.removeClass("current");
        return;
    }

    // operace nad strankamy
    console.log(toPage.selector);
    if(toPage.selector=="#page-profil")
    {
        console.log("profilUpdate");
        profilUpdate();
    }
    if(toPage.selector=="#page-koupit")
    {

        //alert("Načítám data");
        //nactiData();
    }
    if(toPage.selector=="#page-koupitSvacuZaplatit") {
        kosikRefresh();
    }
}

function kosikZobrazCisloVkolecku() {
    var kosikPocetPolozek = kosik.length;
    if(kosikPocetPolozek>0) {
        $("#circleKosikH1").text(kosikPocetPolozek);
        $("#circleKosikH1").css('display','block');
    } else
    {
        $("#circleKosikH1").css('display','none');
    }


}



function kosikAdd(vlozitID) {
    kosik.push(vlozitID);
    kosikZobrazCisloVkolecku();

}


function ajaxError(xhr, textStatus, error){
    console.log(xhr.statusText);
    console.log(textStatus);
    console.log(error);
}
function ajaxError2(data){
    console.log(data);
    console.log("alertuji");
    alert("Nelze se připojit k serveru!")
    //alert($.param(data));
;
}

function nactiData() {

    objednavka = "";
    nactiZboziAjax();
    //nactiZbozi();
    //alert(zbozi.list[1].name);

}

function profilUpdate()
{
    $.ajax({ url:'http://demo.livecycle.cz/fajnsvaca/api/getUserInfo',
        success: function(data) {
            if(data.status == "ok")
            {
                $( "#profilUsernameH" ).text(data.username==null?"":data.username);
                $( "#profilJmenoH" ).text(data.jmeno==null?"":data.jmeno);
                $( "#profilPrijmeniH" ).text(data.jmeno==null?"":data.prijmeni);
                $( "#profilEmailH" ).text(data.jmeno==null?"":data.email);
                $( "#profilTridaH" ).text(data.jmeno==null?"":data.trida);
                $( "#profilSkolaH" ).text(data.jmeno==null?"":data.skola);
                $( "#profilTelefonH" ).text(data.jmeno==null?"":data.telefon);
                //if(data.jmeno ==null) console.log("prazdne");
            }
        },
        error: ajaxError2


    });




}

function prihlaseniZobrazDialog()
{

    //prihlaseniProceed();
    transition("#page-prihlaseni","fade");

}

function prihlaseniProceed()
{
// TODO vymazat heslo z input field
    $.ajax({ url:'http://demo.livecycle.cz/fajnsvaca/api/login?username=' + $('#prihlaseniJmeno').val() + '&password='+$('#prihlaseniHeslo').val()  }).done(function(data) {
        //prihlasenostCheck(data);
        console.log(data);
        if( data.status == "ok")
        {
            console.log("prihlaseni ok");
            alert("přihlášen ok");
            //transition("#page-dokoncitPlatbuPozitivni","fade");
            nactiData();
            $('#koupitUserName').text($('#prihlaseniJmeno').val());
            transition("#page-home","fade");

        }
        else
        {
            ajaxError2(data);
        }
    });


}

function logout()
{
    $.ajax({ url:'http://demo.livecycle.cz/fajnsvaca/api/logout' }).done(function(data) {

    });


}



function registrovat() {
    if(validateRegistrace())
    {
        $.ajax({ url:'http://demo.livecycle.cz/fajnsvaca/api/registerUser?username=' + $('#registraceUsername').val() + '&firstName='+$('#registraceJmeno').val()+ '&lastName='+$('#registracePrijmeni').val()+ '&password='+$('#registraceHeslo').val()+ '&email='+$('#registraceEmail').val(),
            success: function(data) {
                if( data.status == "error")
                {
                    //ajaxError2(data);
                    alertZobraz(data.msg);
                    return;
                }
                if( data.status == "ok")
                {
                    alert("Zaregistrováno!");
                    //nactiZbozi(data);
                    prihlaseniZobrazDialog();

                }
            },
            error: ajaxError2


        });
    }
}

function nactiZboziAjax() {
    $.ajax({ url:'http://demo.livecycle.cz/fajnsvaca/api/listProducts',
        success: function(data) {
            if( data.status == "error" && data.code == "not logged")
            {
                console.log(data.msg);
                console.log("neprihlasen");
                alertZobraz(data.msg);
                prihlaseniZobrazDialog();
                return;
            }
            if( data.status == "error")
            {
                ajaxError2(data);
                return;
            }
            if( data.status == "ok")
            {

                nactiZbozi(data);
            }
        },
        error: ajaxError2


    });
}

function nactiZbozi(data) {
    //var data2 = jQuery.parseJSON({"status":"ok","categories":[{"id":"1","icon":"products/productsHousky.png","name":"Housky"},{"id":"2","icon":"products/productsBagety.png","name":"Bagety"}],"products":[{"id":"1","icon":"products/productsSekanaVHousce.png","price":"29","name":"Sekaná v housce","category_id":"0"},{"id":"2","icon":"products/productsRyzekVHousce.png","price":"33","name":"Řízek v housce","category_id":"0"},{"id":"3","icon":"products/productsSyrVHousce.png","price":"30","name":"Smažený sýr v housce","category_id":"0"},{"id":"4","icon":"products/productsVegetBageta.png","price":"35","name":"Klobásky v housce","category_id":"0"},{"id":"5","icon":"products/productsOblozenaBageta.png","price":"43","name":"Obložená bageta","category_id":"0"},{"id":"6","icon":"products/productsVegetBageta.png","price":"38","name":"Vegetariánská bageta","category_id":"0"}]}');
    zbozi = data.products;
    kategorie = data.categories;
    //kategorie = jQuery.parseJSON('[{"id":"0","icon":"products/productsHousky.png","name":"Housky"},{"id":"2","icon":"products/productsBagety.png","name":"Bagetyy"}]');
    var kategorieIndex = 0;
    console.log("zbozi");
    //zbozi = jQuery.parseJSON( '[{"id":"1","icon":"bageta.jpg","price":"47","name":"Bageta","category_id":"0"},{"id":"2","icon":"chleba.jpg","price":"21","name":"Chleba","category_id":"0"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"}]' );
    //zbozi = jQuery.parseJSON( '[{"id":"1","icon":"bageta.jpg","price":"47","name":"Bageta","category_id":"0"},{"id":"2","icon":"chleba.jpg","price":"21","name":"Chleba","category_id":"0"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"},{"id":"3","icon":"susenky.jpg","price":"12","name":"Sušenky","category_id":"1"}]' );
    console.log(kategorie);
    $("#ulVybratSvacu").empty();


// vloz prvni kategorii
    if(kategorie[0].id==zbozi[0].category_id)
    {
        $( "#ulVybratSvacu" ).append( '<li class="produktTyp zluta"><img class="produktTypImg" src="'+appPreffix+kategorie[0].icon+'"  ><a href=""><h2>'+kategorie[0].name+'</h2></a></li>' );
    }

    var poradiZbozi = 1;
    $.each(zbozi, function()
    {
        // vloz kategorii jestli je jina nez doposud
        // najdi kategorii vyhovujici zbozi
        if(kategorie[kategorieIndex].id!=this.category_id)
        {
//console.log("davam kategorii");
            console.log(kategorieIndex);
            console.log(kategorie[kategorieIndex].id);
            while(kategorie[kategorieIndex].id!=this.category_id && kategorieIndex<kategorie.length-1)
            {
                kategorieIndex ++;
            }

            if(kategorie[kategorieIndex].id==this.category_id)
            {
                $( "#ulVybratSvacu" ).append( '<li class="produktTyp zluta"><img class="produktTypImg" src="'+appPreffix+kategorie[0].icon+'"  ><a href=""><h2>'+kategorie[kategorieIndex].name+'</h2></a></li>' );
                console.log("davam");
            }
        }
        // vloz produkt

        if(poradiZbozi != zbozi.length) {
            $( "#ulVybratSvacu" ).append( '<li class="produkt"><div class="produktKosik" onclick="kosikAdd('+this.id+')">Přidat do<br>košíku</div>  <div class="produktPopis" href="">  <img src="'+appPreffix+this.icon+'"  >  <span class="cena">'+ this.price +' Kč</span>  <h3>' + this.name + '</h3>  <span>'+ this.description+'</span>  </div>  <div class="produktLine"></div>  </li>' );
        } else
        // posledni polozka specialni format
        {
            $( "#ulVybratSvacu" ).append( '<li class="produkt"><div class="produktKosik" onclick="kosikAdd('+this.id+')">Přidat do<br>košíku</div>  <div class="produktPopis" href="">  <img src="'+appPreffix+this.icon+'"  >  <span class="cena">'+ this.price +' Kč</span>  <h3>' + this.name + '</h3>  <span>'+ this.description+'</span>  </div>  <div style="clear:both"></div>  </li>' );
        }
        poradiZbozi ++;
    });
}


function kosikRefresh() {
    kosikSoucetCeny= 0;
    kosik.sort();
    $("#ulKosik").empty();
    //$( "#ulKosik" ).append( '<li class="produktTyp produktHeaderSpace"><div style="height: 20px"></div></li>' );    
    //$( "#ulKosik" ).append( '<li class="listHeader zelena"><h3>Zaplatit sváču</h3></li>' );
    $.each(kosik, function() {
        var zboziIndex = 0;
        for(var i = 0; i< zbozi.length; i++)
        {
            if(zbozi[i].id == this) {
                zboziIndex = i;
            }
        }
        kosikSoucetCeny += Number(zbozi[zboziIndex].price);
        $( "#ulKosik" ).append( '<li class="produkt">  <a class="produktKosik blueOblibene" onclick="oblibeneAdd('+this.id+')">Přidat do<br>oblíbených</a>  <a class="produktPopis" href="">  <img src="'+appPreffix+zbozi[zboziIndex].icon+'"  >  <span class="cena">'+zbozi[zboziIndex].price+' Kč</span>  <h3>'+zbozi[zboziIndex].name+'</h3>  <span>'+zbozi[zboziIndex].description+'</span>  </a>  <div class="produktLine"></div>  </li>' );
    });
    //$( "#ulKosik" ).append( '<li class="listHeader fialova"><h3>Celkem '+kosikSoucetCeny+' kč</h3></li>' );
    //$( "#ulKosik" ).append( '<li class="produktTyp produktHeaderSpace">  <div style="height: 20px"></div>  </li>' );
    //$( "#ulKosik" ).append( '<li class="listTlacitko zelena"><a onclick="javascript:objednavkaProceed()" href="#">  <h3>Zaplatit</h3></a></li>' );
    $( "#kosikSoucetCenyH" ).text("Celkem " + kosikSoucetCeny + " Kč");
}

function objednavkaProceed() {
    console.log("vytvarim objednavku");
    objednavka = "";
    kosik.sort();
    var pocet = 1;
    for(var i = 0; i< kosik.length; i++)
    {
        if(kosik[i] == kosik[i+ 1]){
            pocet ++;
        }
        else
        {
            if(objednavka.length > 0) {
                objednavka += ",";
            }
            objednavka += + String(kosik[i]) + ":" + String(pocet);
            pocet = 1;
        }

    }
    console.log(objednavka);
    //transition("#page-dokoncitPlatbuPozitivni","fade");
    odeslatObjednavku(objednavka,0);

}

function odeslatObjednavku(objednavka, typ) {

    $.ajax({
        type: 'POST',
        url: 'http://demo.livecycle.cz/fajnsvaca/api/createOrder?proceed='+typ+'&basket='+objednavka,
        data : objednavka,
        success : function(data) {

            if(typ==0) {
                // TODO zjistit jeslti je ok
                if(data.status=="ok")
                {
                    $('#dokoncitObjednavkuVyse').text("Objednávka ve výši " + kosikSoucetCeny + " Kč");
                    $('#okoncitObjednavkuKredit').text("Aktuální kredit " + data.balanceBefore + " Kč");
                    $('#okoncitObjednavkuZustatek').text("Budoucí zůstatek " + data.balanceAfter + " Kč");
                    transition("#page-dokoncitPlatbuPozitivni","fade");
                } else
                {
                    alert(data.msg);
                    transition("#page-dokoncitNegativnii","fade");
                }

            }
            if(typ==1) {
                // TODO zjistit jeslti je ok
                transition("#page-potvrzeniPlatby","fade");
            }
        },
        error: ajaxError2
    });



    return;
}

function alertZobraz(msg) {
    alert(msg);
}

// ------------------------------------------------ validace poli
var nepovoleneZnaky = "";

function validateDo(k) {
    // TODO regularni vyraz
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
}

// validace znaku
function validateKeyCharacters(e) {
    var k;
    document.all ? k = e.keyCode : k = e.which;
    return validateDo(k)
}

// validace vlozeneho textu
function validateCharacters(e) {
    if(!validateCharactersDo(e))
    {
        alert("Text obsahuje nepovolené znaky: " + nepovoleneZnaky);
    }
}

function validateCharactersDo(e) {
    nepovoleneZnaky = "";
    var validnost = true;
    if(e==null) return;
    for(var i=0; i<e.length;i++)
    {
        //alert("kontroluji:" + e.substring(i,i+1));
        //alert(validateKeyCharacters(e.substring(i,i+1)));
        var k = e.substring(i,i+1).charCodeAt(0);
        if(!validateDo(k))
        {
            nepovoleneZnaky += e.substring(i,i+1);
        }
    }
    //alert(e);
    if(nepovoleneZnaky!="")
    {
        //alert("Text obsahuje nepovolené znaky: " + nepovoleneZnaky);
        validnost = false;
    }
    return validnost;
}



// validace password poli po vlozeni
function validatePassword(e) {
    if(!validatePasswordDo(e))
    {
        alert("Hesla se neshoduji!");
    }
}

function validatePasswordDo(e) {
    var validnost = true;
    // validnost textu
    if(e==null) return true;
    if(validateCharactersDo(e))
    {
        // reseni shody hesel
        if($( "#registraceHeslo2" ).val() !="")
        {
            if($("#registraceHeslo").val() != $("#registraceHeslo2").val())
            {
                validnost = false;
            }
        }
    } else
    {
        validnost = false;
    }
    return validnost;

}

// validace polí registrace
function validateRegistrace() {
    var validnost = true;
    if(!validateCharactersDo($("#registraceUsername").val()))
    {
        validnost = false;
        alertZobraz("Přihlašovací jméno obsahuje nepovolené znaky: " + nepovoleneZnaky);
    }
    if(!validateCharactersDo($("#registraceJmeno").val()) && validnost)
    {
        validnost = false;
        alertZobraz("Jméno obsahuje nepovolené znaky: " + nepovoleneZnaky);
    }

    if(!validateCharactersDo($("#registracePrijmeni").val()) && validnost)
    {
        validnost = false;
        alertZobraz("Příjmení obsahuje nepovolené znaky: " + nepovoleneZnaky);
    }

    if(!validateCharactersDo($("#registraceHeslo").val()) && validnost)
    {
        validnost = false;
        alertZobraz("Heslo obsahuje nepovolené znaky: " + nepovoleneZnaky);
    }
    if(!validateCharactersDo($("#registraceHeslo2").val()) && validnost)
    {
        validnost = false;
        alertZobraz("Potvrzení hesla obsahuje nepovolené znaky: " + nepovoleneZnaky);
    }
    if(!validatePasswordDo())
    {
        validnost = false;
        alertZobraz("Hesla se neshodují");
    }
    if(!validateCharactersDo($("#registraceEmail").val()) && validnost)
    {
        validnost = false;
        alertZobraz("E-mail obsahuje nepovolené znaky: " + nepovoleneZnaky);
    }
    return validnost;

}