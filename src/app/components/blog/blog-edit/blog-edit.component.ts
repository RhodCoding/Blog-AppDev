import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlogService } from '../../../services/blog.service';
import { AuthService } from '../../../services/auth.service';
import { BlogPost } from '../../../models/blog-post.model';

@Component({
  selector: 'app-blog-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  template: `
    <div class="edit-post-container">
      <mat-card *ngIf="post">
        <mat-card-header>
          <mat-card-title>Edit Post</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="editForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title">
              <mat-error *ngIf="editForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Summary</mat-label>
              <textarea matInput formControlName="summary" rows="3"></textarea>
              <mat-error *ngIf="editForm.get('summary')?.hasError('required')">
                Summary is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Content</mat-label>
              <textarea matInput formControlName="content" rows="10"></textarea>
              <mat-error *ngIf="editForm.get('content')?.hasError('required')">
                Content is required
              </mat-error>
            </mat-form-field>

            <div class="button-container">
              <button mat-button type="button" routerLink="/blog">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="editForm.invalid">
                Save Changes
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .edit-post-container {
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
export class BlogEditComponent implements OnInit {
  editForm: FormGroup;
  post: BlogPost | null = null;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPost(postId);
    } else {
      this.router.navigate(['/blog']);
    }
  }

  private loadPost(id: string): void {
    this.blogService.getPostById(id).subscribe({
      next: (post) => {
        this.post = post;
        
        // Check if user is authorized to edit this post
        if (this.authService.currentUserValue?.id !== post.authorId) {
          this.snackBar.open('You are not authorized to edit this post', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/blog']);
          return;
        }

        // Populate form with post data
        this.editForm.patchValue({
          title: post.title,
          summary: post.summary,
          content: post.content
        });
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.router.navigate(['/blog']);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.valid && this.post) {
      const { title, summary, content } = this.editForm.value;
      
      this.blogService.updatePost(this.post.id, {
        title,
        summary,
        content
      }).subscribe({
        next: () => {
          this.snackBar.open('Post updated successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/blog']);
        },
        error: (error) => {
          console.error('Error updating post:', error);
          this.snackBar.open('Error updating post', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
}
