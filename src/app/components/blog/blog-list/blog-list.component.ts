import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BlogService } from '../../../services/blog.service';
import { AuthService } from '../../../services/auth.service';
import { BlogPost } from '../../../models/blog-post.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="blog-list-container">
      <div class="header">
        <h1>Blog Posts</h1>
        <button mat-raised-button color="primary" routerLink="/blog/create" *ngIf="authService.currentUserValue">
          <mat-icon>add</mat-icon>
          Create New Post
        </button>
      </div>
      
      <div class="blog-grid">
        <mat-card *ngFor="let post of blogPosts" class="blog-card">
          <mat-card-header>
            <mat-card-title>{{ post.title }}</mat-card-title>
            <mat-card-subtitle>By {{ post.authorName }} | {{ post.createdAt | date }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p>{{ post.summary }}</p>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button [routerLink]="['/blog', post.id]">READ MORE</button>
            <button mat-icon-button color="warn" *ngIf="canEdit(post)" (click)="deletePost(post.id)">
              <mat-icon>delete</mat-icon>
            </button>
            <button mat-icon-button color="primary" *ngIf="canEdit(post)" [routerLink]="['/blog/edit', post.id]">
              <mat-icon>edit</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .blog-list-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .blog-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    mat-card-content {
      flex-grow: 1;
    }
    mat-card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class BlogListComponent implements OnInit {
  blogPosts: BlogPost[] = [];

  constructor(
    private blogService: BlogService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  private loadBlogPosts(): void {
    this.blogService.getAllPosts().subscribe({
      next: (posts) => {
        this.blogPosts = posts;
      },
      error: (error) => {
        console.error('Error loading blog posts:', error);
      }
    });
  }

  canEdit(post: BlogPost): boolean {
    const currentUser = this.authService.currentUserValue;
    return currentUser?.id === post.authorId;
  }

  deletePost(id: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.deletePost(id).subscribe({
        next: () => {
          this.blogPosts = this.blogPosts.filter(post => post.id !== id);
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        }
      });
    }
  }
}
