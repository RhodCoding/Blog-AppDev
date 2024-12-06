import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BlogService } from '../../../services/blog.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-blog-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="create-post-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Create New Post</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title">
              <mat-error *ngIf="postForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Summary</mat-label>
              <textarea matInput formControlName="summary" rows="3"></textarea>
              <mat-error *ngIf="postForm.get('summary')?.hasError('required')">
                Summary is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Content</mat-label>
              <textarea matInput formControlName="content" rows="10"></textarea>
              <mat-error *ngIf="postForm.get('content')?.hasError('required')">
                Content is required
              </mat-error>
            </mat-form-field>

            <div class="button-container">
              <button mat-button type="button" [routerLink]="['/blog']">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="postForm.invalid">
                Create Post
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .create-post-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    mat-form-field {
      width: 100%;
    }
    .button-container {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
  `]
})
export class BlogCreateComponent {
  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.postForm.valid && this.authService.currentUserValue) {
      const { title, summary, content } = this.postForm.value;
      const user = this.authService.currentUserValue;
      
      this.blogService.createPost({
        title,
        summary,
        content,
        authorId: user.id,
        authorName: user.username,
        isPublic: true
      }).subscribe({
        next: () => {
          this.router.navigate(['/blog']);
        },
        error: (error) => {
          console.error('Error creating post:', error);
        }
      });
    }
  }
}
