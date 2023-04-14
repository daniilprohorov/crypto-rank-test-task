import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Prices } from './app.types';
import { QueryDto } from './app.dto';
import { ConvertError, convert } from './app.convert';

const validationError = (msg) => {
  throw new BadRequestException('Validation error', {
    cause: new Error(),
    description: msg,
  });
};

const apiAccessError = (msg) => {
  throw new NotFoundException('API access error', {
    cause: new Error(),
    description: msg,
  });
};

@Injectable()
export class AppService {
  async getPrices(
    apiUrl = 'https://tstapi.cryptorank.io/v0/coins/prices/',
  ): Promise<Map<string, number> | null> {
    return axios
      .get(apiUrl)
      .then((response: AxiosResponse<Prices>) => {
        const data = response.data.data;
        const result = new Map(data.map((coin) => [coin.key, coin.price]));
        return result;
      })
      .catch(function (error) {
        return null;
      });
  }

  async convert(query: QueryDto) {
    return await this.getPrices().then((prices) => {
      console.log(query);
      if (prices === null) {
        apiAccessError('Can not get prices from API');
      }
      try {
        const convertedValue = convert(
          query.from,
          query.to,
          query.amount,
          prices,
        );
        return {
          from: query.from,
          to: query.to,
          amount: query.amount,
          result: convertedValue,
        };
      } catch (e) {
        if (e instanceof ConvertError) {
          validationError(e.message);
        }
        throw new InternalServerErrorException(e.message);
      }
    });
  }
}
