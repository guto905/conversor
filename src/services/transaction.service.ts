import { prisma } from "../utils/db";
import axios from "axios";

interface Conversion {
  id: number;
  userId: number;
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
  exchangeRate: number;
  createdAt: string | undefined;
}

interface GetConvertedValueProps {
  userId: number;
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
}

export const TransactionService: {
  getConvertedValue: ({ ...props }: GetConvertedValueProps) => Promise<{
    conversion: Conversion;
    targetAmount: number;
  }>;
} = Object.assign({
  async getConvertedValue({
    userId,
    sourceCurrency,
    targetCurrency,
    sourceAmount,
  }: GetConvertedValueProps): Promise<{
    conversion: Conversion;
    targetAmount: number;
  }> {
    try {
      const { data } = await axios.get(
        `${process.env.EXCHANGE_API_URL}?from=${sourceCurrency}&to=${targetCurrency}&amount=${sourceAmount}`,
        {
          headers: {
            apikey: process.env.EXCHANGE_API_KEY,
          },
        }
      );

      const exchangeRate = data.info.rate;
      const targetAmount = sourceAmount * exchangeRate;

      const conversion: Conversion = await prisma.transaction.create({
        data: {
          userId,
          sourceCurrency,
          sourceAmount: Number(sourceAmount),
          targetCurrency,
          exchangeRate,
          createdAt: Date.now().toString(),
        },
      });

      return { conversion, targetAmount };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
});
