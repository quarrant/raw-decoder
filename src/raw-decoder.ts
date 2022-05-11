type ArrayItemType<ArrayType> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export class RawDecoder<Raw> {
  constructor(private readonly raw: Raw | undefined) { }

  public getProperty<Property extends keyof NonNullable<Raw>>(
    property: Property,
  ): RawDecoder<NonNullable<Raw>[Property]> {
    if (!(this.raw as any)?.hasOwnProperty(property)) {
      console.warn(`[RawDecoder/getProperty] property '${String(property)}' not found in raw '${JSON.stringify(this.raw)}'`);
    }

    return new RawDecoder(this.raw?.[property]);
  }

  public valueOf() {
    return this.raw;
  }

  public asString() {
    if (typeof this.raw === 'string' || typeof this.raw === 'number') {
      return String(this.raw);
    }

    return '';
  }

  public asNumber() {
    if (typeof this.raw === 'string' || typeof this.raw === 'number' || typeof this.raw === 'bigint') {
      const value = Number(this.raw);
      if (!Number.isNaN(value)) {
        return value;
      }
    }

    return 0;
  }

  public asBoolean() {
    if (typeof this.raw === 'undefined' || this.raw === null) {
      return false;
    }

    return Boolean(this.raw);
  }

  public asArray<ArrayItem>(iteratte: (r: RawDecoder<ArrayItemType<Raw>>) => ArrayItem): ArrayItem[] {
    if (Array.isArray(this.raw)) {
      return this.raw.map((r: ArrayItemType<Raw>) => {
        const decoder = new RawDecoder(r);
        return iteratte(decoder);
      });
    }

    return [];
  }

  public asJSON(): Record<string, any> | undefined {
    try {
      if (typeof this.raw === 'string') {
        return JSON.parse(this.raw);
      }
    } catch (error) {
      console.warn(`[decodeJSON] raw=${this.raw}`, error);
    }

    return undefined;
  }

  public asObject(defaultValue?: Record<string, any>) {
    if (this.raw === null || typeof this.raw === 'undefined' || Array.isArray(this.raw) || Number.isNaN(this.raw)) {
      return Object(defaultValue);
    }

    return Object(this.raw);
  }
}
