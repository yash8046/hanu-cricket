const express = require('express');
const cors = require('cors');
const app = express();
const stripe = require('stripe')('sk_test_51QmgKsDOD0bw94hzIw7WBJr6yqArrq3trTT5X6XIroAbhSiWoAPJwpUX0IBZgWTlgZ03TiWqiszZEPQIj8eymj2500L3of84fo');

app.use(cors());
app.use(express.json());


async function createCustomerWithDefaultPaymentMethod(paymentMethodId) {
    try {
        // Create a new customer
        const customer = await stripe.customers.create();

        // Attach the payment method to the customer
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customer.id
        });

        // Set the default payment method for the customer
        const updatedCustomer = await stripe.customers.update(customer.id, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        return updatedCustomer;
    } catch (error) {
        console.error('Failed to create customer and attach payment method:', error);
        throw error;
    }
}

// Endpoint for creating monthly subscriptions
app.post('/api/subscribe', async (req, res) => {
    const { paymentMethodId, priceId } = req.body;
    try {
        const customer = await createCustomerWithDefaultPaymentMethod(paymentMethodId);

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
        });

        res.json({ success: true, subscriptionId: subscription.id, customer: customer.id });
    } catch (error) {
        console.error('Error in creating subscription:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

app.listen(5000, () => console.log('Server listening on port 5000!'));