const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const md5 = require("md5");
const alert = require("alert");


main().catch(err => console.log(err));

async function main() {

  mongoose.connect("mongodb://127.0.0.1:27017/projectDB", { useNewUrlParser: true });


  const app = express();
  app.use(express.static("public"));
  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({
    extended: true
  }));


  const userSchema = new mongoose.Schema({
    Email: String,
    password: String,
    first_name: String,
    last_name: String,
    location: String,
    age: Number,
    phone_number: Number
  });

  const productSchema = new mongoose.Schema({
    product_id: Number,
    name: String,
    price: Number,
    quantity: Number,
    category: String
  })

  const categorySchema = new mongoose.Schema({
    name: String
  })


  const User = new mongoose.model("User", userSchema);
  const Product = new mongoose.model("Product", productSchema);
  const Category = new mongoose.model("Category", categorySchema);

  app.get("/", function (req, res) {
    res.render("home");
  })

  app.get("/login", function (req, res) {
    res.render("login");
  })

  app.get("/register", function (req, res) {
    res.render("register");
  })

  app.get("/forget_password", function (req, res) {
    res.render("forget");
  })

  app.get("/inventory", function (req, res) {
    res.render("inventory");
  })

  app.get("/update_profile", function (req, res) {
    res.render("profile");
  })

  app.get("/products", function (req, res) {
    res.render("products");
  })

  app.get("/categories", function (req, res) {
    res.render("category");
  })

  app.get("/create_product", function (req, res) {
    res.render("create_product");
  })

  app.get("/add_products_category", function (req, res) {
    res.render("create_product");
  })

  app.get("/update_product", function (req, res) {
    res.render("update_product");
  })

  app.get("/delete_product", function (req, res) {
    res.render("delete_product");
  })

  app.get("/create_category", function (req, res) {
    res.render("create_category");
  })

  app.get("/delete_category", function (req, res) {
    res.render("delete_category");
  })

  app.get("/update_category", function (req, res) {
    res.render("update_category");
  })


  app.post("/register", function (req, res) {
    const newUser = new User({
      Email: req.body.username,
      password: md5(req.body.password),
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      location: req.body.location,
      age: req.body.age,
      phone_number: req.body.phone_number
    });

    const Email = req.body.username;

    User.findOne({ email: Email }, function (err, foundUser) {
      if (foundUser) {
        alert("Email already registered.try loging in")
        res.render("login");
      } else {
        newUser.save(function (err) {
          if (err) {
            console.log(err);
          }
          else {
            console.log("new user formed");
            res.render("inventory");
          }
        })
      }
    })

  });


  app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({ email: username }, function (err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("inventory");
          } else {
            console.log("wrong password");
          }
        }
      }
    });
  }
  );

  app.post("/forget_password", function (req, res) {
    const username = req.body.username;
    const new_password = req.body.new_password;
    const confirm_password = req.body.confirm_password;

    User.findOne({ email: username }, function (err, foundUser) {
      if (foundUser.password === new_password) {
        console.log("try again");
        res.render("forget");
      } else {
        if (foundUser) {
          if (new_password === confirm_password) {
            User.updateOne({ id: foundUser.id }, {
              password: md5(new_password), function(err) {
                if (err) {
                  console.log(err);
                }
              }
            })
          }
        }
      }
    });
  })

  app.post("/profile", function (req, res) {
    const username = req.body.username;
    const age = req.body.age;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const location = req.body.location;
    const phone_number = req.body.phone_number;


    User.updateOne({ email: username }, { age: age })
    User.updateOne({ email: username }, { phone_number: phone_number })
    User.updateOne({ email: username }, { first_name: first_name })
    User.updateOne({ email: username }, { last_name: last_name })
    User.updateOne({ email: username }, { location: location })

  })


  app.post("/create_product", function (req, res) {

    const name = req.body.Name;
    const price = req.body.Price;
    const quantity = req.body.Quantity;
    const category = req.body.Category;
    const product_id = req.body.Product_id;

    const newProduct = new Product({
      name: name,
      price: price,
      quantity: quantity,
      category: category,
      product_id: product_id
    })

    const newCategory = new Category({
      name: category
    })

    Product.findOne({ product_id: product_id }, function (err, foundProduct) {
      if (foundProduct) {
        console.log("product already registered");
        res.render("inventory");
      } else {
        newProduct.save();
      }
    })

    Category.findOne({ name: category }, function (err, foundCategory) {
      if (foundCategory) {
        console.log("category already formed ");
      } else {
        newCategory.save();
        res.render("inventory");
      }
    })

    res.render("inventory");
  })

  app.post("/update_product", function (req, res) {
    const name = req.body.Name;
    const price = req.body.Price;
    const quantity = req.body.Quantity;
    const category = req.body.Category;
    const product_id = req.body.Product_id;

    Product.updateOne({ product_id: product_id }, { name: name })
    Product.updateOne({ product_id: product_id }, { category: category })
    Product.updateOne({ product_id: product_id }, { price: price })
    Product.updateOne({ product_id: product_id }, { quantity: quantity })
    app.render("inventory");
  })


  app.post("/delete_product", function (req, res) {
    const id = req.body.Product_id;
    Product.deleteOne({ product_id: id });
  })

  app.post("/create_category", function (req, res) {
    const name = req.body.category_name;

    Category.findOne({ name: name }, function (err, foundCategory) {
      if (foundCategory) {
        console.log("Category Already existed");
        res.render("inventory");
      } else {
        const newCategory = new Category({
          name: name
        })
        newCategory.save();
        res.render("inventory");
      }
    })
  })


  app.post("/delete_category", function (req, res) {
    const name = req.body.category_name;

    Category.deleteOne({ name: name });
    Product.deleteMany({ category: name });
    res.render("inventory");
  })


  app.post("/update_category", function (req, res) {
    const old_category = req.body.old_category_name;
    const nem_category = req.body.new_category_name;

    Category.updateOne({ name: old_category }, { name: nem_category });
    Product.updateMany({ category: old_category }, { category: nem_category });
    res.render("inventory");

  })

  app.post("/list_products", function (req, res) {
    Product.find({}, function (err, Products) {
      res.render("list_products", {
        items: Products
      });
    });
  });

  app.post("/list_categories", function (req, res) {
    Category.find({}, function (err, categories) {
      res.render("list_category", {
        items: categories
      });
    });
  });



  app.listen(3000, function () {

    console.log("server started on port 3000.");

  });

}

