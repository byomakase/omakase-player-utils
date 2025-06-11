import { UserAgent, UserAgentPlatform } from "../types/user-agent";

export class UserAgentUtil {
  static get window(): Window {
    return window;
  }

  static get navigator(): Navigator {
    return window.navigator;
  }

  static get userAgent(): UserAgent {
    const userAgentText = this.navigator?.userAgent || "";
    if (/Android/i.test(userAgentText)) return "android";
    if (/Firefox/i.test(userAgentText)) return "firefox";
    if (/Edg/i.test(userAgentText)) return "edge";
    if (
      (/Chrome/i.test(userAgentText) || /CriOS/i.test(userAgentText)) &&
      !/Edg/i.test(userAgentText)
    )
      return "chrome";
    if (/Chrome/i.test(userAgentText) || /CriOS/i.test(userAgentText))
      return "chromium";
    if (/Safari/i.test(userAgentText)) return "safari";
    return "unknown";
  }

  static get platform(): UserAgentPlatform {
    const platformText: string =
      //@ts-ignore
      this.navigator?.["userAgentData"]?.platform || this.navigator?.platform;
    if (platformText?.toUpperCase().includes("MAC")) return "macos";
    if (platformText?.toUpperCase().includes("WIN")) return "windows";
    if (platformText?.toUpperCase().includes("LINUX")) return "linux";
    return "unknown";
  }

  static isUserAgent(agent: UserAgent): boolean {
    return this.userAgent === agent;
  }

  static isPlatform(platform: UserAgentPlatform): boolean {
    return this.platform === platform;
  }

  static open(url: string, target: "_blank" | "_self" = "_blank") {
    this.window.open(url, target);
  }
}
