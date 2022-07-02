var app = angular.module('myApp', ["ngRoute"]);
app.config(function($routeProvider){
    $routeProvider
    .when("/home", {
        templateUrl : "home.html"
    })
    .when("/comparison", {
        templateUrl : "comparison.html"
    })
    .when("/aboutus", {
        templateUrl : "aboutus.html"
    })
    .when("/collection", {
        templateUrl : "collection.html"
    })
    .when("/stylist", {
        templateUrl : "stylist.html"
    })
    .when("/product", {
        templateUrl : "product.html"
    })
    .otherwise({
        templateUrl : "home.html"
    })
});

app.controller('myCtrl',function($scope, $http){
    function getData(){
        $http.get('data.json').then(function(rspt) {
            if(localStorage.getItem ("data") == null) {
                localStorage.setItem("data", JSON.stringify(rspt.data));   
                $scope.data= JSON.parse(localStorage.getItem("data"));  

            }     
            else{
                $scope.data= JSON.parse(localStorage.getItem("data"));
            }
            location.hash.split("=")[1] == undefined ? $scope.IDselectedProduct = 0 : $scope.IDselectedProduct = location.hash.split("=")[1];
            $scope.selectedProduct = $scope.data.product[$scope.IDselectedProduct];
            $scope.commentlist = [];
            $scope.comment_icon = $scope.data.comment_icon;
            $scope.selectedIcon = $scope.comment_icon[0]
            for (let i = 0; i < $scope.data.comment.length; i++) {
                if($scope.data.comment[i].productid == $scope.IDselectedProduct){
                    $scope.commentlist[$scope.commentlist.length] = $scope.data.comment[i];
                }     
            }
            $scope.stylist = $scope.data.stylist;
            $scope.collection = $scope.data.collection;

            $scope.springList = []
            $scope.summerList = []
            $scope.fallList = []
            $scope.winterList = []

            for (let i = 0; i < $scope.data.product.length; i++) {
                var item = $scope.data.product[i];
                item.collection == 0 ? $scope.springList[$scope.springList.length] = item : true
                item.collection == 1 ? $scope.summerList[$scope.summerList.length] = item : true
                item.collection == 2 ? $scope.fallList[$scope.fallList.length] = item : true
                item.collection == 3 ? $scope.winterList[$scope.winterList.length] = item : true
            }

            $scope.productListCollection = [
                $scope.springList,
                $scope.summerList,
                $scope.fallList,
                $scope.winterList
            ]
        })
    }
    getData();
    $scope.imgnum = 0;
    $scope.currentImg = "Images/banner/banner00.jpg"
    $scope.changeImage = function(slide){
        imglist = $scope.data.banner
        if (slide) {
            $scope.imgnum++;
            $scope.imgnum >= imglist.length ? $scope.imgnum = 0 : $scope.imgnum = $scope.imgnum
        }
        else{
            $scope.imgnum--;
            $scope.imgnum < 0 ? $scope.imgnum = imglist.length-1 : $scope.imgnum = $scope.imgnum
        }
        $scope.currentImg = imglist[$scope.imgnum];
    }

    $scope.IDselectedProduct = 0;

    $scope.starRating = 5;
    $scope.rating = function(star){
        console.log(star);
        $scope.starRating = star;
    }

    $scope.addComment = function(name,star,productid,comment){
        var obj = {
            $$hashKey: $scope.data.comment.length + 1000,
            id: $scope.data.comment.length,
            icon:$scope.selectedIcon.icon,
            name:name,
            star: star,
            productid: productid,
            comment: comment
        }
        $scope.commentlist[$scope.commentlist.length] = obj
        $scope.data.comment[$scope.data.comment.length] = obj
        localStorage.setItem("data", JSON.stringify($scope.data));   
    }
    $scope.changeIcon = function(icon){
        $scope.selectedIcon = icon
    }

    $scope.PopupLogin = false;

    $scope.showPopupLogin = function(){
        $scope.PopupLogin = !$scope.PopupLogin
    }
    var namecheck = /^[a-zA-Z]\w{7,11}$/
    $scope.login = function(user,pass){
        if(user == "" || user == undefined){
            alert("Username can not be blank")
        }else if(!namecheck.test(user)){
            alert("Username star with a alphabet character, length is 8-12 and doesn't contain Special characters")
        }else if(pass == undefined || pass.length < 6 || pass.length > 12){
            alert("Password has length between 6 to 12 character")
        }else{
            var check = false;
            for (let i = 0; i < $scope.data.account.length; i++) {
                if(user == $scope.data.account[i].user && pass == $scope.data.account[i].pass){
                    $scope.PopupLogin = false; 
                    check = true;
                    break
                }
            }
            if(check){
                alert("Sign in success")
            }else{
                alert("Username or Password is wrong")
            }
        }
    }
    $scope.signup = function(user,pass,name){
        if(user == "" || user == undefined){
            alert("Username can not be blank")
        }else if(!namecheck.test(user)){
            alert("Username star with a alphabet character, length is 8-12 and doesn't contain Special characters")
        }else if(pass == undefined || pass.length < 6 || pass.length > 12){
            alert("Password has length between 6 to 12 character")
        }else if(name =="" || name == undefined){
            alert("Name can not be blank")
        }else{
            var check = true;
            for (let i = 0; i < $scope.data.account.length; i++) {
                if(user == $scope.data.account[i].user){
                    check = false;
                    break
                }
            }
            if(check){
                $scope.data.account[$scope.data.account.length] = {
                    "name": name,
                    "user": user,
                    "pass": pass
                }
                localStorage.setItem("data", JSON.stringify($scope.data));
                alert("Sign up success")
            }else{
                alert("Username has existed")
            }
        }
    }
    $scope.googlemap = 'http://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q={{Property.Address.Location.Latitude}},{{Property.Address.Location.Longitude}}&amp;output=embed'
});


