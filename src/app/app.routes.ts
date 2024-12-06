import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { BlogListComponent } from './components/blog/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog/blog-detail/blog-detail.component';
import { BlogCreateComponent } from './components/blog/blog-create/blog-create.component';
import { BlogEditComponent } from './components/blog/blog-edit/blog-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: '/blog', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'blog', component: BlogListComponent },
  { path: 'blog/create', component: BlogCreateComponent },
  { path: 'blog/edit/:id', component: BlogEditComponent },
  { path: 'blog/:id', component: BlogDetailComponent }
];
