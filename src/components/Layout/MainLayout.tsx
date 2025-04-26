import { ReactNode } from 'react';
import '../../styles/layout.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="main-layout">
      <header className="header">
        <div className="logo">AI 图片内容分析</div>
        <nav className="nav">
          <ul>
            <li><a href="/">首页</a></li>
            <li><a href="/about">关于</a></li>
          </ul>
        </nav>
      </header>
      
      <main className="content">
        {children}
      </main>
      
      <footer className="footer">
        <p>© 2025 AI 图片内容分析项目</p>
      </footer>
    </div>
  );
};

export default MainLayout;