import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BlogService } from '../../../services/blog.service';
import { BlogPost } from '../../../models/blog-post.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule
  ],
  template: `
    <div class="blog-detail-container" *ngIf="blogPost">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ blogPost.title }}</mat-card-title>
          <mat-card-subtitle>
            By {{ blogPost.authorName }} | {{ blogPost.createdAt | date:'medium' }}
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="blog-content">
            {{ blogPost.content }}
          </div>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-button routerLink="/blog">BACK TO POSTS</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .blog-detail-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .blog-content {
      margin-top: 20px;
      line-height: 1.6;
    }
    mat-card {
      padding: 20px;
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  blogPost: BlogPost | null = null;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadBlogPost(postId);
    }
  }

  private loadBlogPost(id: string): void {
    this.blogService.getPostById(id).subscribe({
      next: (post) => {
        this.blogPost = post;
      },
      error: (error) => {
        console.error('Error loading blog post:', error);
      }
    });
  }
}
