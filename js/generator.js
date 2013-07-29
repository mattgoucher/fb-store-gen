var App         = angular.module("storemaker", ["storemaker.controllers"]),
    Controllers = angular.module("storemaker.controllers", []);

App.config(["$routeProvider", function($routeProvider) {

    // Home
    $routeProvider.when("/", {
        controller: "generatorCtrl"
    });

    // Default
    $routeProvider.otherwise({
        redirectTo: "/"
    });

}]);


Controllers.controller("generatorCtrl", [
    "$scope",
    function ($scope) {

        window.fuck = $scope;

        var createdProducts = 0;


        // Current Scope
        $scope.products      = {};
        $scope.storeSettings = {};
        $scope.isEditing     = false;
        $scope.output        = "Add a product, and generate."


        /**
         * Reset form models
         * @return {undefined}
         */
        function resetFormsToPristine() {
            $scope.product       = {};
            $scope.editedProduct = {};
        }


        /**
         * Get a product based on its id
         * @param  {int} id product id
         * @return {object} the product
         */
        function getProductById(id) {
            return $scope.products[id];
        }


        /**
         * Push product into products array
         * @return {undefined}
         */
        $scope.addProduct = function() {

            var product = $scope.product;

            // Increment total count
            createdProducts = createdProducts + 1;

            // Add product Id to new product.
            product.id = createdProducts;

            // Push Product to array
            $scope.products[createdProducts] = product;

            // Reset forms
            resetFormsToPristine();

        };


        /**
         * Copy a product for editing
         * @param  {object} product The product we are editing
         * @return {undefined}
         */
        $scope.editProduct = function(product) {

            // We're Editing
            $scope.isEditing = true;

            // Create a copy of an existing product
            // so we don't overwrite the current settings first.
            $scope.editedProduct = angular.copy(product);

        };


        /**
         * Save changes to an existing product
         * @return {undefined}
         */
        $scope.saveExistingProduct = function() {

            var edits = $scope.editedProduct;

            // Save over the current product
            $scope.products[edits["id"]] = edits;

            // No longer editing
            $scope.isEditing = false;

            // Reset forms
            resetFormsToPristine();

        };


        /**
         * Delete a product from memory
         * @param  {object} product product to be deleted
         * @return {undefined}
         */
        $scope.deleteProduct = function(product) {

            if (confirm("Delete. Seriously, Gone Forever")) {

                // DELETE KEY
                delete $scope.products[product["id"]];

            }else{
                $scope.isEditing = false;
            }

        };


        /**
         * Parse HTML templates, spit it out
         * @return {string} HTML markup for the store
         */
        $scope.generate = function() {

            var finalSettings = { store: $scope.storeSettings, products: $scope.products };
                productTemplate = document.getElementById("product-item").innerHTML,
                output        = _.template(document.getElementById("before-html").innerHTML, finalSettings);

            console.log(finalSettings);

            // Generate Product HTML
            for (var product in finalSettings.products) {
                console.log('asd');
                console.log(finalSettings.products[product]);
                output += _.template(productTemplate, finalSettings.products[product]);
            }

            output += document.getElementById("after-html").innerHTML;

            $scope.output = output;

            document.getElementById("preview-frame").contentDocument.documentElement.innerHTML = String($scope.output)

        }

    }
]);
