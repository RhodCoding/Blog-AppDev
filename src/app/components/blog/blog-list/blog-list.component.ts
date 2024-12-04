import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BlogService } from '../../../services/blog.service';
import { BlogPost } from '../../../models/blog-post.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule
  ],
  template: `
    <div class="blog-list-container">
      <h1>Blog Posts</h1>
      
      <div class="blog-grid">
        <mat-card *ngFor="let post of blogPosts" class="blog-card">
          <mat-card-header>
            <mat-card-title>{{ post.title }}</mat-card-title>
            <mat-card-subtitle>By {{ post.authorName }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <p>{{ post.summary }}</p>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button [routerLink]="['/blog', post.id]">READ MORE</button>
          </mat-card-actions>
          
          <mat-card-footer>
            <small>{{ post.createdAt | date }}</small>
          </mat-card-footer>
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
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .blog-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    mat-card-content {
      flex-grow: 1;
    }
    mat-card-footer {
      padding: 8px 16px;
      color: #666;
    }
  `]
})
export class BlogListComponent implements OnInit {
  blogPosts: BlogPost[] = [];

  constructor(private blogService: BlogService) {}

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
}
