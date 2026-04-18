import axios from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymobService {
    private baseUrl = 'https://accept.paymob.com/api';

    // 1. get Auth Token from paymob 
    async getAuthToken(): Promise<any> {
        const res = await axios.post(
            `${this.baseUrl}/auth/tokens`,
            { api_key: process.env.PAYMOB_API_KEY },
        );
        return res.data.token;
    }

    // 2. Create Order from paymob 
    async createOrder(token: string, amount: number) {
        const res = await axios.post(
            `${this.baseUrl}/ecommerce/orders`,
            {
                auth_token: token,
                delivery_needed: false,
                amount_cents: amount * 100,
                currency: 'EGP',
                items: [],
            },
        );
        return res.data;
    }

    // 3. Payment Key
    async getPaymentKey(
        token: string,
        orderId: number,
        amount: number,
        first_name: string,
        phone_number: string,
        email: string,
        country?: string,
    ): Promise<any> {
        const res = await axios.post(
            `${this.baseUrl}/acceptance/payment_keys`,
            {
                auth_token: token,
                amount_cents: amount * 100,
                expiration: 3600,
                order_id: orderId,
                currency: 'EGP',
                integration_id: process.env.PAYMOB_INTEGRATION_ID,
                billing_data: {
                    first_name: first_name,
                    last_name: 'User',
                    phone_number: phone_number,
                    email: email,
                    country: country,
                    city: 'Cairo',
                    street: 'NA',
                    building: 'NA',
                    floor: 'NA',
                    apartment: 'NA',

                },
            },
        );
        return res.data.token;
    }
}
