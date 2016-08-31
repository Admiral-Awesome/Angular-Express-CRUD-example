angular.module("tableApp", ["ngResource"])
.constant("baseUrl", "http://localhost:3000/api/items/")
.controller("defaultCtrl", function ($scope, $http, $resource, baseUrl) {
    $scope.currentView = 'table';
    $scope.currentItem = {};
    $scope.itemsResource = $resource(baseUrl + ":id", { id: "@id" });
    // обновление списка
    $scope.refresh = function () {
    $scope.items = $scope.itemsResource.query();
    };

        // создание нового элемента
    $scope.create = function (item) {
        new $scope.itemsResource(item).$save().then(function (newItem) {
            $scope.items.push(newItem);
            $scope.currentView = "table";
        });
    }

    // обновление элемента
    $scope.update = function (item) {
        $http.put(baseUrl  + item._id, item);
        $scope.currentView = "table";
    }

    // удаление элемента из модели
    $scope.delete = function (item) {
       $http.delete(baseUrl  + item._id, item);
        $scope.refresh();
    }

    // редеактирование существующего или создание нового элемента
    $scope.editOrCreate = function (item) {
        $scope.currentItem = item ? item : {};
        $scope.currentView = "edit";
    }

    // сохранение изменений
    $scope.saveEdit = function (item) {
        console.log(item._id);
        if (angular.isDefined(item._id)) {
            $scope.update(item);
            $scope.currentItem = {};
        } else {
            $scope.create(item);
        }
    }

    // отмена изменений и возврат в представление table
    $scope.cancelEdit = function () {
        
        $scope.currentItem = {};
        $scope.currentView = "table";
    }

    $scope.refresh();
});
