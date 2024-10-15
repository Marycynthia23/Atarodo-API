// This test secret API key is a placeholder. Don't include personal details in requests with this key.
// To see your test secret API key embedded in code samples, sign in to your Stripe account.
// You can also find your test secret API key at https://dashboard.stripe.com/test/apikeys.
const stripe = require('stripe')('sk_test_51Q9mzTRr95j5UGaYGsVV4Uqmbpkat0OF9FdTsqZTVDTsG4XFYNHUU0mpOJY7LBqEkC0oFpLqlwzqbHKFko24LFhG00BVJxcU3y');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend domain or allowed origin
  }));
// app.use(express.static('public'));1
app.use(express.json());


const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
    const { firstName, lastName, email, phone, price } = req.body;

    try {
        console.log("got here")
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                // price: 'prod_R1qsHL92deIDto',
                price_data: {
                    currency: 'usd',
                    product_data: {
                      name: 'Lifetime Access',
                      description: `Lifetime access for ${firstName} ${lastName}`,
                    },
                    unit_amount: price,
                  },
                quantity: 1,
          
              },
            ],
            mode: 'payment',
            customer_email: email,
            success_url: `${YOUR_DOMAIN}/success`,
            cancel_url: `${YOUR_DOMAIN}/cancel`,
        });

        // res.json({ id: session.id });
        //   res.redirect(303, session.url);
        res.send({
            id: session.id
        });
    } catch (error) {
        console.log(error)
    }

});

app.get("/success", (req, res)=>{
    res.redirect("http://localhost:3000/success")
})

app.get("/cancel", (req, res)=>{
    res.redirect("http://localhost:3000/failed")
})

app.listen(4242, () => console.log('Running on port 4242'));