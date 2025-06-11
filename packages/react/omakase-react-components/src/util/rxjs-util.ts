import { Subject, Subscriber } from "rxjs";

export function completeSub(subscriber: Subscriber<void> | Subject<void>) {
  subscriber.next();
  subscriber.complete();
}
