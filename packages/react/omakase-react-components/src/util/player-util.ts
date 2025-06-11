export class PlayerUtil {

  static createUrl(flowId: string, timerange: string | undefined) {
    return `/player/${flowId}?timerange=${timerange ? timerange : '()'}`;
  }

}
