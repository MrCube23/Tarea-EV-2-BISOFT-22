import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICategory } from '../interfaces';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService<ICategory>{
  protected override source: string = 'categories';
  private itemListSignal = signal<ICategory[]>([]);
  private snackBar = inject(MatSnackBar);
  
  get items$() {
    return this.itemListSignal
  }

  public getAll(): Observable<ICategory[]> {
    return this.findAll().pipe(
      map((response: any) => {
        response.reverse();
        // Assuming response is already of type ICategory[], otherwise, transform it here
        this.itemListSignal.set(response); // Assuming you still need to set this for other purposes
        return response;
      }),
      catchError((error: any) => {
        console.log('error', error);
        throw error; // Rethrow or handle as needed
      })
    );
  }

  public save(item: ICategory) {
    this.http.post<ICategory>('categories/new', item).subscribe({
      next: (response: any) => {
        this.itemListSignal.update((categories: ICategory[]) => [response, ...categories]);
      },
      error: (error: any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('error', error);
        console.error('error', error);
      }
    });
  }
  

  public update(item: ICategory) {
    this.edit(item.id, item).subscribe({
      next: () => {
        const updatedItems = this.itemListSignal().map(category => category.id === item.id ? item : category);
        this.itemListSignal.set(updatedItems);
      },
      error: (error : any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('error', error);
        console.error('error', error);
      }
    })
  }

  public delete(category: ICategory) {
    this.del(category.id).subscribe({
      next: () => {
        const updatedItems = this.itemListSignal().filter((g: ICategory) => g.id != category.id);
        this.itemListSignal.set(updatedItems);
      },
      error: (error : any) => {
        this.snackBar.open(error.error.description, 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('error', error);
      }
    })
  }

}
