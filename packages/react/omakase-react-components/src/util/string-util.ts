export class StringUtil {
  public static isNullUndefinedOrWhitespace(value: string | undefined | null): boolean {
    if (typeof value === void 0 || value == null) {
      return true;
    }
    return `${value}`.replace(/\s/g, '').length < 1;
  }

  public static isNonEmpty(value: string | undefined | null): boolean {
    return !StringUtil.isNullUndefinedOrWhitespace(value);
  }

  public static endsWith(value: string, suffix: string): boolean {
    if (!StringUtil.isNullUndefinedOrWhitespace(value) && !StringUtil.isNullUndefinedOrWhitespace(suffix)) {
      return value.indexOf(suffix, value.length - suffix.length) !== -1;
    } else {
      return false;
    }
  }

  public static toMixedCase(value: string): string {
    let escapeList: { [key: string]: string } = {NBCU: 'NBCU', REDBEE: 'Red Bee', CMORE: 'C More', TV2: 'TV2', BBC: 'BBC'};

    return value.replace(/_/g, ' ').split(' ')
      .map(word => {
        return word in escapeList ? escapeList[word] : `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
      })
      .join(' ');
  }

  public static replaceWhitespace(searchValue: string, replaceValue: string): string {
    return searchValue ? searchValue.trim().replace(/([\n ]*,[\n ]*|[\n ]+)/g, replaceValue).replace(new RegExp(`${replaceValue}$`), '') : searchValue;
  }

  public static whitespacesToCommas(searchValue: string): string {
    return StringUtil.replaceWhitespace(searchValue, ',');
  }

  public static tokenizeWhitespaceSeparated(value: string): string[] | undefined {
    return value ? StringUtil.replaceWhitespace(value, ' ').split(' ') : void 0;
  }
}


