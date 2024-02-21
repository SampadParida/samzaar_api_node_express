import Product from '../models/product.js'


const getProducts = async (req, res) => {
    const query = req.query.category && req.query.category != 'all' ? { category : req.query.category } : {};
    await Product.find(query, {__v:0})
        .then(found => {
            return res.json(found);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
};

const getProductDetails = async (req, res) => {
    await Product.findOne({_id:req.params.id})
        .then(found => {
            return res.send(found);
        })
        .catch(err => {
            return res.status(500).send(err);
        });
};

const addProduct = async (req, res) => {
    if(!req.body.title){
        return res.status(400).send('Product title missing.')
    }
    if(!req.body.description){
        return res.status(400).send('Product description missing.')
    }
    if(!req.body.image){
        return res.status(400).send('Product image missing.')
    }
    if(!req.body.price){
        return res.status(400).send('Product price missing.')
    }
    if(!req.body.category){
        return res.status(400).send('Product category missing.')
    }
    const newProduct = new Product({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        category: req.body.category
    })
    await newProduct
        .save()
        .then(
            (entry) => { return res.send(entry) },
            (err) => {
                res.status(500);
                return res.send(`'Could not create and entry! = ${err}`)
            }
        )
};

export {
    getProducts, addProduct, getProductDetails
};