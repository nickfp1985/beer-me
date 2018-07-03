$(document).ready(function () {

    /*NIGEL CODE:*/

    randomDrink();
    // function to create random picture images in the dom 
    function randomDrink() {
        console.log('RANDOM DRINKS!');

        for (let i = 0; i < 4; i++) {

            let queryURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

            $.ajax({
                url: queryURL,
                method: 'get'
            }).then(function (response) {
                console.log(response.drinks[0]);
                console.log(response.drinks[0].strDrinkThumb);

                // set variables for final html page 
                let drinkName = response.drinks[0];
                let div = $('<div>');
                let imgSrc = drinkName.strDrinkThumb;

                let img = $(`<img src="${imgSrc}" id="${drinkName.idDrink}" class="results-img">`);
                img.addClass('drinks')
                    .css({ "height": "250px", "width": "250px", "border-radius": "10px", "margin": "10px" })
                    .on('click', function () {
                        $('.landing-page').hide();
                        $('.container-results').empty();
                        $('.container-results').show();
                    });
                let name = $('<p>');


                name.text(drinkName.strDrink);
                name.addClass('name').css({ "text-align": "center" });

                //COPY AND PASTE INDIVIDUAL .AJAX REQUEST CODE HERE:

                //  END INDIVIDUAL .AJAX REQUESET CODE    */

                // append info to page 
                div.append(img);
                div.append(name);
                $('.random-four').append(div);
            })

        }
    }

    /*COMMENTED THIS CLICK LISTENER OUT FOR NOW:
    $(document).on('click', '.drinks', function () {
        console.log($(this));
        let drinkID = $(this).attr('id');
        console.log(drinkID);
    })
    /*END NIGEL CODE:*/

    $(document).on('click', '.results-img', function () {

        console.log($(this).attr('id'));

        $('.container-results').empty();
        $('.container-results').hide();
        $('.final-drink').show();
        /* https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=13060 : EXAMPLE URL FOR ID SEARCH */

        let findByIdBaseURL = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="
        let drinkID = $(this).attr('id');
        let fullQueryURLByID = findByIdBaseURL + drinkID;
        fullQueryURLByID.toString().trim();

        $.ajax({
            url: fullQueryURLByID,
            method: "GET"
        }).then(function (res) {

            //HERE ARE THE RESULTS WE WILL USE TO GENERATE NEW PAGE WITH COMPLETE DRINK INFORMATION INCLUDING INREDIENTS, AMOUNTS, HOW TO INSTRUCTIONS ETC.
            let data = res.drinks[0];
            console.log(data);
            console.log(Object.keys(data));

            let drinkObj = {}

            drinkObj.imgSrc = data.strDrinkThumb;
            drinkObj.name = data.strDrink;
            drinkObj.withAlcohol = data.strAlcoholic;
            drinkObj.glassType = data.strGlass;
            drinkObj.instructions = data.strInstructions;
            drinkObj.ingredients = [];
            drinkObj.amounts = [];

            //PULLING INGREDIENTS INTO ARRAY:
            //CREATE AN ARRAY FROM OBJECT ENTRIES
            let drinkInfoArray = Object.entries(data);
            //CREATE AN ARRAY OF ONLY INGREDIENT PAIRS:
            let drinkIngredients = [];
            for (let i = 9; i < 24; i++) {
                drinkIngredients.push(drinkInfoArray[i]);
            }
            //CREATE FINAL ARRAY OF INGREDIENTS:
            for (let i = 0; i < drinkIngredients.length; i++) {
                let individualIngredient = drinkIngredients[i][1];
                if (individualIngredient === "") {
                } else if (individualIngredient) {
                    drinkObj.ingredients.push(individualIngredient);
                }
            }
            console.log("INGREDIENTS");
            console.log(drinkObj.ingredients);

            let amountsInfoArray = Object.entries(data);
            let drinkAmounts = [];
            for (let i = 24; i < 39; i++) {
                drinkAmounts.push(amountsInfoArray[i]);
            }
            //CREATE FINAL ARRAY OF AMOUNTS:
            for (let i = 0; i < drinkAmounts.length; i++) {
                let individualAmount = drinkAmounts[i][1];
                if (individualAmount === " ") {
                } else if (individualAmount) {
                    drinkObj.amounts.push(individualAmount);
                }
            }
            console.log("AMOUNTS:");
            console.log(drinkObj.amounts);

            $('.drink-name').text(`${drinkObj.name}`);
            $('.drink-alcoholic').text(`${drinkObj.withAlcohol}`);
            $('.drinkThumb2').attr('src', `${drinkObj.imgSrc}`);
            $('.drink-glass').text(`${drinkObj.glassType}`);
            $('.instructions').html(`<p>${drinkObj.instructions}</p>`);
            $('.list').empty();

            for (let i = 0; i < drinkObj.ingredients.length; i++) {

                let $row = $('<tr>').addClass(`item:${i}`);

                let $ingredient = $(`<td class="ingredient border-right">${drinkObj.ingredients[i]}</td>`);
                let $amount = $(`<td class="measure">${drinkObj.amounts[i]}</td>`);

                $row.append($ingredient);
                $row.append($amount);

                $('.list').append($row);

            }


        });


    })

    $('#newSearch').on('click', function (event) {

        event.preventDefault();

        $('.landing-page').show();
        $('.container-results').empty();
        $('.random-four').empty();
        $('.final-drink').hide();
        randomDrink();

    })

    $('#searchAlcohol').on('click', function (event) {

        event.preventDefault();

        $('.landing-page').hide();
        $('.container-results').empty();
        $('.container-results').show();

        let $alcoholName = $('#inputAlcohol').val().trim();
        let baseURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=";
        let queryURL = baseURL + $alcoholName;
        queryURL.toString().trim();

        ajaxRequest(queryURL);

    });

    $('#searchName').on('click', function (event) {

        event.preventDefault();

        $('.landing-page').hide();
        $('.container-results').empty();
        $('.container-results').show();

        //DEVELOPING QUERY URL STRING FROM DRINK-NAME INPUT:
        let $drinkName = $('#inputDrinkName').val().trim();
        let baseURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
        let queryURL = baseURL + $drinkName;
        queryURL.toString().trim();

        console.log(queryURL);

        //EXAMPLE AJAX REQUEST:
        ajaxRequest(queryURL);

    }) /*end of submit click listener*/

    $('#searchGlass').on('click', function (event) {

        event.preventDefault();

        $('.landing-page').hide();
        $('.container-results').empty();
        $('.container-results').show();

        //DEVELOPING QUERY URL STRING FROM DRINK-NAME INPUT:
        let $glassType = $('#glassType').val().trim();
        let baseURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=";
        let queryURL = baseURL + $glassType;
        queryURL.toString().trim();

        console.log(queryURL);

        //EXAMPLE AJAX REQUEST:
        ajaxRequest(queryURL);

    }) /*end of submit click listener*/


    //AJAX REQUEST FUNCTION TAKES UNIQUE QUERY URL AS ARGUMENT:
    function ajaxRequest(uniqueURL) {

        //FIRST .AJAX REQUEST:
        $.ajax({
            url: uniqueURL,
            method: "GET"
        }).then(function (res) {
            console.log(res);

            //RESPONSE IS USUALLY AN ARRAY, SET UP A FOR LOOP WITH ARRAY.LENGTH:
            let resultsLength = res.drinks.length;
            console.log(resultsLength);
            console.log(resultsLength * 2);

            // //APPEND NEWSEARCH BUTTON AHEAD OF FOR LOOP:
            // // <input class="btn btn-outline-warning" id="newSearch" type="submit" value="New Search">

            // let $newSearchDynamic = $('<input class="btn btn-outline-warning" id="newSearch" type="submit" value="New Search">');
            // $newSearchDynamic.on('click', function (event) {

            //     event.preventDefault();

            //     $('.landing-page').show();
            //     $('.container-results').empty();
            //     $('.random-four').empty();
            //     // $('.final-drink').hide();
            //     randomDrink();

            // });

            // $('.container-results').after($newSearchDynamic);

            //USING JQUERY TO CREATE DIVS OR 'THUMBNAIL RESULTS' ON SCREEN CONTAINING DRINK IMAGE + DRINK NAME:
            //  (!)should probably substitute forEach or filter array methods here(!)
            for (let i = 0; i < resultsLength; i++) {

                let $target = $('.container-results');

                let $imgAndNameContainer = $('<div class="drinkThumb1">');

                let $img = $(`<img src="${res.drinks[i].strDrinkThumb}" id="${res.drinks[i].idDrink}" class="results-img">`)
                    .addClass('img-fluid');
                // .addClass('drinkThumb1');

                //APPLYING CLICK LISTENER TO EACH 'THUMBNAIL RESULT' - ON CLICK THE DIV WILL NEED TO:
                //PASSING .AJAX CALL TO EACH RESULTS IMAGE ON CLICK:
                // $img.on('click', function () {

                //     //IF ERROR RETURN PASTE HERE:

                // }); /*end image click listener*/

                let $name = $(`<h5>${res.drinks[i].strDrink}</h5>`)
                    .css({ "text-align": "center", "color": "white", "margin-top": "10px" });

                $imgAndNameContainer.append($img);
                $imgAndNameContainer.append($name);

                $target.append($imgAndNameContainer);


            }
        })

    }

}) /*END DOC.READY()*/