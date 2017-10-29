import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Http } from '@angular/http';
import constants from '../../constants';

@Injectable()
export class SearchService {
    private allItems: Observable<string>;
    private queriedItemsList: string[] = [];
    public queriedItems: Subject<string[]> = new Subject();

    constructor(private http:Http) {
        this.allItems = Observable.from(['hi', 'foo', 'baa', 'auto']);

        // this.allitems = this.getPredictions();


    }

    getPredictions(query: string): Observable<ValueKey> {
        console.log("Searching for " + query );
        return this.http.get("http://localhost:5000"+'/auto?term='+query)
            .map(response => response.json())
            .concatMap(vk => {
                console.log(vk)
                return Observable.from(vk)
                    .map(vk => new ValueKey(vk))

            })
            .do(console.log);
    }

    addQueriedItem(item:string) {
        this.queriedItemsList.push(item);
        this.queriedItems.next(this.queriedItemsList)
    }


    removeQueriedItem(item: string) {
        let idx = this.queriedItemsList.indexOf(item)
        if (idx > -1) {
            this.queriedItemsList.splice(idx, 1);
        }
        this.queriedItems.next(this.queriedItemsList)
    }
}

export class ValueKey {
    public value:string;
    public key:string;

    constructor(valueKey:any){
        this.key = valueKey[0];
        this.value = valueKey[1];
    }

}