(function() {

    var Generator = (function() {

        var totalCreated,
            productId,
            generate,
            Products,
            storeSettings,
            AddProductForm,
            AddProductInputs,
            StoreSettingsForm,
            AddProductSubmitBtn;

        function Generator() {

            var self         = this,
                previewBtn   = $("#preview"),
                previewFrame = $("#preview-frame");
            
            totalCreated = 0;

            // Product Form
            Products            = {};
            AddProductForm      = $("#product-settings"),
            AddProductInputs    = AddProductForm.find('input').not(".btn");
            AddProductSubmitBtn = AddProductForm.find('input[type="submit"]');

            // Created Products List
            CreatedProductsList = $("#products-list");

            // Store Settings
            storeSettings       = {};
            StoreSettingsForm   = $("#page-settings");

            // How many we created
            productId           = $("#productId");

            // Map for testing
            self.Products = Products;

            updateProductId();

            /**
             * Take values from inputs and create project-object
             * @param  {event} e   form submission event
             * @return {undefined}
             */
            self.addProduct = function(e) {

                var errors   = 0,
                    settings = {};

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
                    AddProductSubmitBtn.val("Add Product").attr("class", "btn");
                    updateProductId();
                    createProduct(settings);
                    zeroProductFields();
                }

            };


            /**
             * Generate the product HTML
             * @type {undefined}
             */
            generate = self.generate = function() {

                LOG("Generate");

                // Save Store Settings
                saveStoreSettings();

                // Update the listing of products
                updateProductsList();

                $("#generator-output").text(produceProductHTML());
            };


            /**
             * Open a preview window (no workie)
             * @return {undefined}
             */
            self.preview = function(e) {

                // Compile All Settings
                self.generate();

                // Swap frame HTML.
                previewFrame.contents().find('body').html(produceProductHTML());

                // Don't Submit Form
                e.preventDefault();

            };


            /**
             * Blow away a product
             * @return undefined
             */
            self.removeProduct = function() {
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


            /**
             * Load up a product for editing
             * @return {undefined}
             */
            self.editProduct = function() {

                var clicked       = $(this),
                    productId     = clicked.attr("rel").replace("product-", ""),
                    loadedProduct = Products[productId];

                if (!loadedProduct) {
                    return alert("Something really bad happened");
                }

                AddProductSubmitBtn.val("Save Changes").attr("class", "btn warning");

                AddProductInputs.each(function() {
                    if (loadedProduct[$(this).attr("id")]) {
                        $(this).val(loadedProduct[$(this).attr("id")]);
                    }
                });

            }


            /**
             * Load a session up from a json-string
             * @param  {string} session json string containing product information
             * @return {undefined}
             */
            self.loadSession = function() {

                var lastProduct = 0,
                    session     = prompt("Paste Session");

                Products = JSON.parse(session);

                for (var key in Products) {
                    lastProduct = Products[key]["productId"];
                }

                totalCreated = lastProduct + 1;

                // Regen
                self.generate();
                updateProductId();

            }


            /**
             * Return the products object, stringifyed
             * @return {string} current session
             */
            self.getSession = function() {

                return alert(JSON.stringify(Products) + '');

            }


            // Bindings
            AddProductForm.on("submit", self.addProduct);
            StoreSettingsForm.on("submit", self.preview);
            CreatedProductsList.on("click", ".edit-product", self.editProduct);
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

            // Output the markup
            generate();

            LOG(Products);

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
                LOG(Products[product]['productId']);
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


        /**
         * Update the DOM with the correct product
         * @return {undefined}
         */
        function updateProductId() {
            totalCreated = totalCreated + 1;
            productId.val(totalCreated);
        }

        return Generator;

    }());

    function LOG (message) {
        if (location.hash === "#debug") {
            console.log(message);
        }
    }

    $(function() {
        window.Generator = new Generator;
        //LOG(window.Generator);
    });

}());
