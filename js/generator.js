(function() {

    var Generator = (function() {

        var generate,
            Products,
            storeSettings,
            AddProductForm,
            AddProductInputs,
            StoreSettingsForm;

        function Generator() {

            var self         = this,
                previewBtn   = $("#preview"),
                totalCreated = 0;

            // Product Form
            Products            = {};
            AddProductForm      = $("#product-settings"),
            AddProductInputs    = AddProductForm.find('input');

            // Created Products List
            CreatedProductsList = $("#products-list");

            // Store Settings
            storeSettings       = {};
            StoreSettingsForm   = $("#page-settings");

            // Map for testing
            self.Products = Products;


            /**
             * Take values from inputs and create project-object
             * @param  {event} e   form submission event
             * @return {undefined}
             */
            self.addProduct = function(e) {

                var errors   = 0,
                    settings = {};

                totalCreated = totalCreated + 1;

                settings["productId"] = totalCreated;

                // Prevent Submit
                e.preventDefault();

                // Grab value from each input
                AddProductInputs.each(function(i) {
                    var input = $(this);

                    if (!input.val() || input.val() === "") {
                        errors = errors + 1;
                    }else{
                        settings[input.attr("id")] = input.val();
                    }

                });

                if (errors) {
                    alert("Please Fill out all fields");
                }else{
                    createProduct(settings);
                    zeroProductFields();
                }

            };


            /**
             * Generate the product HTML
             * @type {undefined}
             */
            generate = self.generate = function() {
                $("#generator-output").text(produceProductHTML());
            };


            /**
             * Open a preview window (no workie)
             * @return {undefined}
             */
            self.preview = function() {
                //data:text/html,
                window.open("data:text/html," + produceProductHTML(), "test");
            };


            /**
             * Load a product up for editing
             * @param  {[type]} a [description]
             * @return {[type]}   [description]
             */
            self.removeProduct = function(a) {
                var clicked = $(this);

                // Delete if con
                if (!confirm("Really, Really delete?")) {
                    return;
                }

                // Remove the dictionary key
                delete Products[clicked.attr("rel").replace("product-", "")];

                // Remove DOM node
                clicked.parent("li").remove();

                // Regen code
                self.generate();

            };


            // Bindings
            previewBtn.on("click", self.preview);
            AddProductForm.on("submit", self.addProduct);
            CreatedProductsList.on("click", ".remove-product", self.removeProduct);

        }


        /**
         * Push the product into the products dictionary
         * @param  {object} productSettings the parts that make up a product
         * @return {undefined}
         */
        function createProduct(productSettings) {

            // Give us the ability to lookup later.
            Products[productSettings["productId"]] = productSettings;

            // Save Store Settings
            saveStoreSettings();

            // Update the listing of products
            updateProductsList();

            // Output the markup
            generate();

            console.log(Products);

        }


        /**
         * Generate the HTML for the product listing
         * @return {string} HTML
         */
        function produceProductHTML() {

            var beforeHTML      = _.template($("#before-html").html(), storeSettings),
                afterHTML       = _.template($("#after-html").html(), storeSettings),
                productTemplate = $("#product-item").html(),
                output          = beforeHTML;

            // Generate Product HTML
            for (var product in Products) {
                output += _.template(productTemplate, Products[product]);
            }

            return output + afterHTML;

        }


        /**
         * Generate the list of already created products
         * @return {undefined}
         */
        function updateProductsList() {

            var itemTemplate = $("#product-list-item").html();

            CreatedProductsList.html('').hide();

            for (var product in Products) {
                console.log(Products[product]['productId']);
                CreatedProductsList.append(
                    $(_.template(itemTemplate, Products[product]))
                ).show();
            }

        }


        /**
         * Grab store settings from DOM
         * @return {undefined}
         */
        function saveStoreSettings() {

            StoreSettingsForm.find("input").each(function() {
                var input = $(this);

                storeSettings[input.attr("id")] = (input.val() || "");
            });

        }


        /**
         * Reset product input fields
         * @return {undefined} [description]
         */
        function zeroProductFields() {
            AddProductInputs.each(function() {
                var input = $(this);

                if (input.attr("type") === "text") {
                    input.val('');
                }

            });
        }


        return Generator;

    }());



    $(function() {
        window.Generator = new Generator;
        //console.log(window.Generator);
    });

}());
