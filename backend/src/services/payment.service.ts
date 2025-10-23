import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { AppDataSource } from '@/database/data-source';
import { Order } from '@/models/Order';
import { config } from '@/config/environment';
import { AppError } from '@/middleware/error-handler';
import { 
  HTTP_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  OrderStatus,
  PaymentStatus
} from '@ecommerce/shared';
import { logger } from '@/utils/logger';

export class PaymentService {
  private stripe: Stripe;
  private orderRepository: Repository<Order>;

  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2023-10-16'
    });
    this.orderRepository = AppDataSource.getRepository(Order);
  }

  async createPaymentIntent(data: { orderId: string; amount: number }, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: data.orderId, userId },
      relations: ['items', 'items.product']
    });

    if (!order) {
      throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new AppError('Order already paid', HTTP_STATUS.BAD_REQUEST);
    }

    // Create payment intent with Stripe
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        userId: userId
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    // Update order with payment intent ID
    order.paymentIntentId = paymentIntent.id;
    await this.orderRepository.save(order);

    logger.info(`Payment intent created for order ${order.id}: ${paymentIntent.id}`);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  }

  async confirmPayment(data: { paymentIntentId: string; orderId: string }, userId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: data.orderId, userId }
    });

    if (!order) {
      throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await this.stripe.paymentIntents.retrieve(data.paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      order.paymentStatus = PaymentStatus.PAID;
      order.status = OrderStatus.CONFIRMED;
      await this.orderRepository.save(order);

      logger.info(`Payment confirmed for order ${order.id}`);

      return {
        order,
        message: SUCCESS_MESSAGES.PAYMENT_SUCCESSFUL
      };
    } else {
      throw new AppError(ERROR_MESSAGES.PAYMENT_FAILED, HTTP_STATUS.BAD_REQUEST);
    }
  }

  async handleStripeWebhook(body: any, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        config.stripe.webhookSecret
      );
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      throw new AppError('Invalid webhook signature', HTTP_STATUS.BAD_REQUEST);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    
    if (orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: orderId }
      });

      if (order) {
        order.paymentStatus = PaymentStatus.PAID;
        order.status = OrderStatus.CONFIRMED;
        await this.orderRepository.save(order);

        logger.info(`Payment succeeded for order ${orderId} via webhook`);
      }
    }
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId;
    
    if (orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: orderId }
      });

      if (order) {
        order.paymentStatus = PaymentStatus.FAILED;
        await this.orderRepository.save(order);

        logger.info(`Payment failed for order ${orderId} via webhook`);
      }
    }
  }
}