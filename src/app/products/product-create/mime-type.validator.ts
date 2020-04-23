import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof(control.value) === "string") {
    return of(null);
  }
  const blob = control.value as File;
  const fileReader = new FileReader();
  const frObservable = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener("loadend", () => {
        const array = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header = "";
        let type = "";
        let isValid = false;
        for (let i = 0; i < array.length; i++) {
          header += array[i].toString(16);
        }
        switch (header) {
          case "89504e47":
            type = "image/png";
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            type = "image/jpeg";
            isValid = true;
            break;
          default:
            type = blob.type;
            isValid = false;
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true, type: type });
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(blob);
    }
  );
  return frObservable;
};
