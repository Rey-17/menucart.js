jQuery(document).ready(function($) {
    /**variables para realizar la eliminación del título de un mercado en el carrito de compras
       cuando los artículos en ese local es 0.
       ----------------------21-9-2016---------------------------------


    **/

    var localValue = []; //<------------array que contendrá los locales con la cantidad de sus productos

    //---------------------------------

    var priceGlob = 0;
    var localext = $(".pr").text();

    $('.ir-arriba').click(function() {
        $('body, html').animate({
            scrollTop: '0px'
        }, 300);
    });

    $(window).scroll(function() {
        if ($(this).scrollTop() > 0) {
            $('.ir-arriba').slideDown(300);
        } else {
            $('.ir-arriba').slideUp(300);
        }
    });


    $('body').on('click', '.mplus', function() { //<------------------botón interno del carrito que le suma un producto
        var n = $(this).attr("id"),
            cant1 = "#artCar_cantidad" + n,
            produ = "#product" + n;
        cant = $(cant1).text();
        cant = parseInt(cant);
        cant = cant + 1;
        $(cant1).text(cant);
        var pv = "#pv" + n,
            dp = "#idp" + n,
            nam = "#product-nameCart" + n,
            prc = "#product-priceCart" + n,
            im = "#imgs" + n;
        var l = "#loc" + n,
            b = $(pv).attr("value"),
            c = $(dp).attr("value");
        var namF = $(nam).html(),
            imF = $(im).attr("src"),
            lo = $(l).attr("value"),
            prcF = $(prc).html(),
            incar = "#qtyincar" + c; //
        var id_input = "#prodinp" + c; //
        $(id_input).text(cant);
        add_cart.extract(namF, prcF, imF, lo, c, cant, b);
    });

    $('body').on('click', '.mminus', function() {
        alert("resta carrito");
        var n = $(this).attr("id"),
            cant1 = "#artCar_cantidad" + n,
            produ = "#product" + n;
        cant = $(cant1).text();
        cant = parseInt(cant);
        cant = cant - 1;
        $(cant1).text(cant);
        var pv = "#pv" + n,
            dp = "#idp" + n,
            nam = "#product-nameCart" + n,
            prc = "#product-priceCart" + n,
            im = "#imgs" + n;
        var l = "#loc" + n,
            b = $(pv).attr("value"),
            c = $(dp).attr("value");
        var namF = $(nam).html(),
            imF = $(im).attr("src"),
            lo = $(l).attr("value"),
            prcF = $(prc).html(),
            incar = "#qtyincar" + c; //
        var id_input = "#prodinp" + c; //
        if (cant == 0) {
            $(incar).hide();
        }
        $(id_input).text(cant);
        add_cart.extract(namF, prcF, imF, lo, c, cant, b);
    });

    $('#shop').on('click', function(event) {
        event.preventDefault();
        $('.cd-panel').addClass('is-visible');
        $('.menusidebar').show();

    });
    $('#shop2').on('click', function(event) {
        event.preventDefault();
        $('.cd-panel').addClass('is-visible');
        $('.menusidebar').show();

    });

    //clode the lateral panel
    $('.cd-panel').on('click', function(event) { //función que cierra el panel del menú
        if ($(event.target).is('.cd-panel')) {
            $('.cd-panel').removeClass('is-visible');
            event.preventDefault();
        }
    });
    $('.closing').on('click', function() { //cierra el panel del carrito al hacer click en el ícono de la x
        $('.cd-panel').removeClass('is-visible');
        event.preventDefault();
    });


    function round(value, decimals) { //<----------------función de redondeo el cúal recibe dos parametros value y decimal
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals); //<------ retornara el valor redondeado
    }

    Array.prototype.unique = function(a) { //<--------función que extraera los valores unicos de un array, es decir que no se repitan
        return function() {
            return this.filter(a)
        }
    }(function(a, b, c) {
        return c.indexOf(a, b + 1) < 0
    });

    var add_cart = { //<------- variable tipo objeto en javascript, el cúal contiene las funciones que se encargaran de la logica del carrito
        Lpv: [],
        articulos: [],
        cantArti: [],
        cantArti2: [],
        locals: [], //<------arrays que contendrán los datos de los productos
        checkD: function() {
            var ls = [],
                that = this;
            if (localStorage.getItem("arty") != null) {
                that.cantArti = JSON.parse(localStorage.getItem("arty"));
                for (var i = 0; i < that.cantArti.length; i++) {
                    $.ajax({
                        data: {
                            "id": that.cantArti[i].id,
                            "pv": that.cantArti[i].pv,
                            "cant": that.cantArti[i].cant
                        },
                        url: 'http://localhost/mandaoLocal/includes/reqimpcar.php',
                        type: 'post',
                        dataType: 'json',
                        success: function(response, cantArti) {
                            ls[i] = response;
                            if ((ls[i].prove == ls[i].idproF) && ((window.location.href == "http://localhost/mandaoLocal/tienda/" + ls[i].url) || (window.location.host == "localhost"))) {
                                var id = ls[i].id_pr;
                                var prodinp = "#prodinp" + id;
                                if (ls[i].cant > 0) {
                                    $(prodinp).parent(".qtyincar").show();
                                    $(prodinp).text(ls[i].cant);
                                }
                                add_cart.extract(ls[i].title, ls[i].price, ls[i].img, ls[i].local, ls[i].id_pr, ls[i].cant, ls[i].prove);
                            } else {
                                add_cart.extract(ls[i].title, ls[i].price, ls[i].img, ls[i].local, ls[i].id_pr, ls[i].cant, ls[i].prove);
                            }

                        },
                        error: function(obj, error, objError) {}
                    });

                }
            } //fin del if

        },
        extract: function(name, price, img, local, id_prod, cant, pv) {
            var that = this;
            that.name = name;
            that.price = price;
            that.img = img;
            that.local = local;
            that.id_prod = id_prod;
            that.cant = cant;
            that.pv = pv;

            that.articulos.push({
                "local": local,
                "name": name,
                "price": price,
                "img": img,
                "cant": cant,
                "id": id_prod,
                "pv": pv
            });
            that.locals.push(local);
            add_cart.verify(that.articulos);
        },
        verify: function(array) {
            var that = this;
            that.array = array;
            for (var i = 0; i < array.length; i++) {
                for (var k = i + 1; k < array.length; k++) {
                    if (array[i].id == array[k].id) {
                        array[i].cant = array[k].cant;
                        array.splice(k, 1);
                    }
                }
                that.cantArti.push({
                    "id": array[i].id,
                    "cant": array[i].cant,
                    "pv": array[i].pv
                });
            }
            for (var i = 0; i < that.cantArti.length; i++) {
                for (var k = i + 1; k < that.cantArti.length; k++) {
                    if (that.cantArti[i].id == that.cantArti[k].id) {
                        that.cantArti[i].cant = that.cantArti[k].cant;
                        that.cantArti.splice(k, 1);
                    }
                }
            }
            add_cart.print(that.array);
            localStorage.setItem("arty", JSON.stringify(that.cantArti));
        },

        print: function(array) {
            this.array = array;
            var price = "";
            var product = "";
            var canti = "";
            var btn = "";
            //De aqui inician las pruebas:
            this.locals = this.locals.unique();

            for (var h = 0; h < this.locals.length; h++) {
                console.log(this.locals[h]);
                var idL = this.locals[h].replace(/\s|&/g, "_");

                var idL2 = "#" + idL;
                var idLoc = "#idLoc" + idL;
                if ($(idLoc).length == 0) {
                    $(".panel-cart").append("<div class='panel-group' id='" + idL + "'><div class='panel panel-default'><div class='panel-heading'><h4 class='panel-title'><a data-toggle='collapse' href='#collapse" + h + "'>" + this.locals[h] + "</a></h4></div><div id='collapse" + h + "' class='panel-collapse collapse in'><div id='idLoc" + idL + "'></div><button class='center-block'></button></div></div></div>");
                }
                for (var i = 0; i < array.length; i++) {
                    product = "#product-nameCart" + i;
                    canti = "#artCar_cantidad" + i;
                    price = "#product-priceCart" + i;
                    btn = "#product" + i;
                    if ($(product).length == 0 && array[i].local == this.locals[h]) {
                        $(idLoc).append("<div id='product" + i + "' class='col-md-12 col-sm-12 col-xs-12 ctntcart'><div class='imgCart col-md-2 col-sm-2 col-xs-2'><img id='imgs" + i + "' class='imgCart center-block img-responsive' src='" + array[i].img + "'></div><div class='product-nameCart col-md-6 col-sm-6 col-xs-6' id='product-nameCart" + i + "'>" + array[i].name + "</div><div class='col-md-2 col-xs-2 col-sm-2'><span class='mplus' id='" + i + "'><i class='btn btn-default fa fa-plus-circle' aria-hidden='true'></i></span><span class='cantInCar' id='artCar_cantidad" + i + "'></span><span class='mminus' id='" + i + "'><i class='btn btn-default fa fa-minus-circle' aria-hidden='true'></i></span></div><div class='product-priceCart col-md-2 col-sm-2 col-xs-2' id='product-priceCart" + i + "'>" + array[i].price + "</div><input type='hidden' id='pv" + i + "' name='pv' value='" + array[i].pv + "'><input type='hidden' id='loc" + i + "' name='loc' value='" + array[i].local + "'><input type='hidden' id='idp" + i + "' name='idp' value='" + array[i].id + "'></div>");
                    }
                    $(canti).html(array[i].cant);
                    if (array[i].cant == 0) {
                        $(product).remove();
                        $(canti).remove();
                        $(price).remove();
                        $(btn).remove();
                    }
                    add_cart.calc(this.array);
                }
            }
        },
        calc: function(array) {
            this.array = array;
            var priceT = 0;
            var priceExt = "";
            for (var i = 0; i < array.length; i++) {
                var canti = parseInt(array[i].cant);
                priceExt = array[i].price;
                priceExt = priceExt.substring(1);
                priceExt = parseFloat(priceExt);
                priceExt = priceExt * canti;
                priceT += priceExt;
                pric = round(priceT, 2);
                priceTF = parseFloat(Math.round(pric * 100) / 100).toFixed(2);
                priceGlob = priceTF;
            }
            if (priceT == 0) {
                $(".numberTotal").text(priceT);
                $(".shopC").show();
            }
            if (priceT > 0) {
                $(".shopC").hide();
                $("#pluscart").show(function() {
                    $("#pluscart").text(priceTF);
                    $(".numberTotal").text(priceTF);
                });
            } else {
                $("#pluscart").hide();
            }
            if (priceTF >= 10.00) {
                $(".paid").attr("href", "http://localhost/mandaoLocal/orden/pago");
                document.cookie = "loPmanda02016=new;path=/";

            } else if (priceTF < 10.00) {
                $(".paid").attr("href", "JavaScript:void(0);");
            }
        }
    };
    //add_cart.ExtCpv();
    add_cart.checkD();

    function isPositive(str) {
        return /^\+?(0|[1-9]\d*)$/.test(str);
    };

    function regIsNumber(value) {
        var isValid = isPositive(value);
        return isValid;
    };
    var qt = 0;

    $('.rest-cart').click(function() { //función que resta los valores en la pagina principal
        alert("restar");
        var id_prod = "";
        var incar = "";
        var num = $(this).attr("id");
        id_prod = num.substring(8);
        var id_input = "#prodinp" + id_prod;
        cant = $(id_input).text();
        cant = parseInt(cant);
        var pv = $(".img-div").attr("id");
        pv = pv.substring(5);
        var nameprod = "#name" + id_prod;
        var priceprod = "#price" + id_prod;
        var imgprod = "#image" + id_prod;
        var incar = "#qtyincar" + id_prod;
        var nameprodF = $(nameprod).text();
        var priceprodF = $(priceprod).text();
        var imgprodF = $(imgprod).attr("src");
        if (regIsNumber(cant) && cant > 0) {
            cant--;
            if (cant == 0) {
                $(incar).hide();
            }
            if (qt > 0) {
                qt--;
            }
            $(id_input).text(cant);
        }
        if (cant > 0) {
            add_cart.extract(nameprodF, priceprodF, imgprodF, localext, id_prod, cant, pv);
        } else {
            add_cart.extract(nameprodF, priceprodF, imgprodF, localext, id_prod, cant, pv);
        }
    });



    $(".button-addtocart").click(function() {
        var cant = "";
        var id_prod = "";
        var incar = "";
        var num = $(this).attr("id");
        var pv = $(".img-div").attr("id");
        pv = pv.substring(5);
        id_prod = num.substring(8);
        var id_input = "#prodinp" + id_prod;
        var nameprod = "#name" + id_prod;
        var priceprod = "#price" + id_prod;
        var imgprod = "#image" + id_prod;
        var incar = "#qtyincar" + id_prod;
        var nameprodF = $(nameprod).text();
        var priceprodF = $(priceprod).text();
        var imgprodF = $(imgprod).attr("src");
        cant = $(id_input).text();
        cant = parseInt(cant);
        cant++;
        $(id_input).text(cant);
        $(incar).show();
        qt = qt + cant;
        add_cart.extract(nameprodF, priceprodF, imgprodF, localext, id_prod, cant, pv);
    });
    $(".paid").click(function() {
        if (priceGlob < 10.00) {
            $(".alertPa").show();
        }

    });

});
