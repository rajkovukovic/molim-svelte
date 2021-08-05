import { Observable } from 'rxjs';
import type { AsyncCollection } from '../wrapper';

export function rxify<T>(collection: AsyncCollection<T>) {
  return new Observable<T>(subscriber => {
    const unsubsriber = collection.listen(data => {
      subscriber.next(data);
    });

    return unsubsriber;
  });
}
