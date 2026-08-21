import type { JobEstimate, Payment } from "../types.js";
import { MockWalletProvider } from "../wallet/MockWalletProvider.js";

export class PaymentService {
  private readonly payments = new Map<string, Payment>();

  constructor(private readonly walletProvider: MockWalletProvider) {}

  async getBalance(): Promise<{ balance: number; currency: "PIXOL" }> {
    return this.walletProvider.getBalance();
  }

  async estimatePayment(estimate: JobEstimate): Promise<Payment> {
    return {
      id: `pay_estimate_${crypto.randomUUID()}`,
      amount: estimate.estimatedCost,
      currency: "PIXOL",
      status: "PENDING",
      createdAt: new Date().toISOString()
    };
  }

  async createPayment(jobId: string, amount: number): Promise<Payment> {
    const balance = await this.walletProvider.getBalance();
    if (balance.balance < amount) {
      throw new Error("Insufficient PIXOL balance");
    }

    const payment: Payment = {
      id: `pay_${crypto.randomUUID()}`,
      jobId,
      amount,
      currency: "PIXOL",
      status: "VERIFIED",
      createdAt: new Date().toISOString()
    };

    this.walletProvider.debit(amount);
    this.payments.set(payment.id, payment);
    return payment;
  }

  async verifyPayment(paymentId: string): Promise<Payment> {
    const payment = this.payments.get(paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }
    return payment;
  }
}
