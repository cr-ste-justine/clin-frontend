import { Dictionary, keyBy } from 'lodash';
// @ts-ignore
import { DataExtractor } from './extractor.ts';

export type Record<T, V> = {
  original: T;
  parsed: V;
};

export type RecordResult<T, V> = {
  name: string;
  records: Record<T, V>[];
};

export abstract class Provider<T, V> {
  // eslint-disable-next-line no-unused-vars
  constructor(public readonly name: string) {}

  // eslint-disable-next-line no-unused-vars
  public abstract doProvide(dataExtractor: DataExtractor): Record<T, V>[];

  public provide(dataExtractor: DataExtractor): RecordResult<T, V> {
    return {
      name: this.name,
      records: this.doProvide(dataExtractor),
    };
  }
}

export class ProviderChain {
  private readonly providers: Provider<any, any>[] = [];

  // eslint-disable-next-line no-unused-vars
  constructor(private readonly data: any) {}

  public add<T, V>(provider: Provider<T, V>) {
    this.providers.push(provider);
    return this;
  }

  public execute(): Dictionary<RecordResult<any, any>> {
    const dataExtrator: DataExtractor = new DataExtractor(this.data);
    const result = this.providers.map((provider) => provider.provide(dataExtrator));

    return keyBy(result, 'name');
  }
}