import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Getting Started with Angular',
      summary: 'Learn the basics of Angular framework and how to build your first application.',
      content: 'Angular is a powerful framework for building web applications. In this post, we will explore the fundamental concepts...',
      authorId: '1',
      authorName: 'Test User',
      createdAt: new Date('2024-01-01'),
      isPublic: true
    },
    {
      id: '2',
      title: 'Angular Material Design',
      summary: 'Implement beautiful UIs with Angular Material components.',
      content: 'Angular Material provides a set of reusable UI components that follow Material Design principles...',
      authorId: '1',
      authorName: 'Test User',
      createdAt: new Date('2024-01-02'),
      isPublic: true
    },
    {
      id: '3',
      title: 'State Management in Angular',
      summary: 'Learn different approaches to manage state in Angular applications.',
      content: 'State management is crucial for building scalable applications. In this post, we will discuss various techniques...',
      authorId: '1',
      authorName: 'Test User',
      createdAt: new Date('2024-01-03'),
      isPublic: true
    }
  ];

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<BlogPost[]> {
    return of(this.mockPosts);
  }

  getPostById(id: string): Observable<BlogPost> {
    const post = this.mockPosts.find(p => p.id === id);
    if (!post) {
      throw new Error('Post not found');
    }
    return of(post);
  }

  getUserPosts(userId: string): Observable<BlogPost[]> {
    const userPosts = this.mockPosts.filter(p => p.authorId === userId);
    return of(userPosts);
  }

  createPost(post: Omit<BlogPost, 'id' | 'createdAt'>): Observable<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: (this.mockPosts.length + 1).toString(),
      createdAt: new Date()
    };
    this.mockPosts.unshift(newPost);
    return of(newPost);
  }

  updatePost(id: string, post: Partial<BlogPost>): Observable<BlogPost> {
    const index = this.mockPosts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Post not found');
    }
    this.mockPosts[index] = { ...this.mockPosts[index], ...post };
    return of(this.mockPosts[index]);
  }

  deletePost(id: string): Observable<void> {
    const index = this.mockPosts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPosts.splice(index, 1);
    }
    return of(void 0);
  }
}
