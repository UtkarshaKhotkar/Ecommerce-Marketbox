import { Repository } from 'typeorm';
import { AppDataSource } from '@/database/data-source';
import { Order } from '@/models/Order';
import { OrderItem } from '@/models/OrderItem';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { AppError } from '@/middleware/error-handler';
import { 
  HTTP_STATUS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  CreateOrder, 
  UpdateOrderStatus,
  OrderStatus,
  PaymentStatus,
  UserRole
} from '@ecommerce/shared';

export class OrderService {
  private orderRepository: Repository<Order>;
  private orderItemRepository: Repository<OrderItem>;
  private productRepository: Repository<Product>;

  constructor() {
    this.orderRepository = AppDataSource.getRepository(Order);
    this.orderItemRepository = AppDataSource.getRepository(OrderItem);
    this.productRepository = AppDataSource.getRepository(Product);
  }

  async getUserOrders(userId: string) {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' }
    });
  }

  async getOrderById(id: string, user: User) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('order.user', 'orderUser')
      .where('order.id = :id', { id });

    // Apply access control
    if (user.role === UserRole.USER) {
      queryBuilder.andWhere('order.userId = :userId', { userId: user.id });
    }
    // Sellers and admins can see all orders

    const order = await queryBuilder.getOne();

    if (!order) {
      throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    return order;
  }

  async createOrder(orderData: CreateOrder, userId: string) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate products and calculate totals
      let subtotal = 0;
      const orderItems: Partial<OrderItem>[] = [];

      for (const item of orderData.items) {
        const product = await this.productRepository.findOne({
          where: { id: item.productId }
        });

        if (!product) {
          throw new AppError(`Product ${item.productId} not found`, HTTP_STATUS.NOT_FOUND);
        }

        if (product.inventory < item.quantity) {
          throw new AppError(ERROR_MESSAGES.INSUFFICIENT_INVENTORY, HTTP_STATUS.BAD_REQUEST);
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          total: itemTotal,
          productName: product.name,
          productImage: product.images[0],
          productSku: product.sku
        });

        // Update inventory
        product.inventory -= item.quantity;
        product.salesCount += item.quantity;
        await queryRunner.manager.save(product);
      }

      // Calculate tax and shipping (simplified)
      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
      const total = subtotal + tax + shipping;

      // Create order
      const order = queryRunner.manager.create(Order, {
        userId,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        notes: orderData.notes
      });

      await queryRunner.manager.save(order);

      // Create order items
      for (const itemData of orderItems) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          ...itemData,
          orderId: order.id
        });
        await queryRunner.manager.save(orderItem);
      }

      await queryRunner.commitTransaction();

      // Fetch complete order
      const completeOrder = await this.orderRepository.findOne({
        where: { id: order.id },
        relations: ['items', 'items.product']
      });

      return {
        order: completeOrder,
        message: SUCCESS_MESSAGES.ORDER_CREATED
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderStatus(id: string, updateData: UpdateOrderStatus, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product']
    });

    if (!order) {
      throw new AppError(ERROR_MESSAGES.ORDER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    // Update order status
    order.status = updateData.status;
    if (updateData.trackingNumber) {
      order.trackingNumber = updateData.trackingNumber;
    }
    if (updateData.notes) {
      order.notes = updateData.notes;
    }

    // Set timestamps based on status
    if (updateData.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    } else if (updateData.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    await this.orderRepository.save(order);

    return {
      order,
      message: SUCCESS_MESSAGES.ORDER_UPDATED
    };
  }
}