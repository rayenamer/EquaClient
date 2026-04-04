import { Component, OnDestroy, ElementRef, ViewChild, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThreeService } from '../../services/three.service';
import { TokensGridComponent } from '../../components/tokens-grid/tokens-grid.component';
import { LogoLoopComponent } from '../../components/logo-loop/logo-loop.component';
import { FeatureStackComponent } from '../../components/feature-stack/feature-stack.component';
import { LetterGlitchComponent } from '../../components/letter-glitch/letter-glitch.component';
import { MarketsTableComponent } from '../../components/markets-table/markets-table.component';
import { PriceChartComponent } from '../../components/price-chart/price-chart.component';

interface StatItem {
  label: string;
  target: number;
  suffix: string;
  current: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TokensGridComponent,
    LogoLoopComponent,
    FeatureStackComponent,
    LetterGlitchComponent,
    MarketsTableComponent,
    PriceChartComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statsSection') statsSectionRef!: ElementRef<HTMLElement>;

  loading = true;
  currentYear = new Date().getFullYear();
  glitchColors = ['#0f0c29', '#1a1a2e', '#FFD700', '#00d4ff', '#16213e'];

  showBackToTop = false;
  faqOpen: number | null = null;
  mobileMenuOpen = false;
  newsletterEmail = '';

  stats: StatItem[] = [
    { label: 'Pays', target: 50, suffix: '+', current: 0 },
    { label: 'Utilisateurs', target: 10, suffix: 'K+', current: 0 },
    { label: 'Transactions', target: 1, suffix: 'M+', current: 0 },
    { label: 'Support', target: 24, suffix: '/7', current: 0 }
  ];
  private statsAnimated = false;
  private statsAnimationFrameId: number | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor(
    private threeService: ThreeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    const tokenImagePath = '/assets/images/equa-token-ref.png';
    this.threeService.init(this.canvasRef, tokenImagePath);
    this.threeService.animate();
    setTimeout(() => {
      this.loading = false;
    }, 1500);
    this.setupStatsObserver();
  }

  getStatDisplayText(stat: StatItem): string {
    return Math.round(stat.current) + stat.suffix;
  }

  private setupStatsObserver(): void {
    if (!this.statsSectionRef?.nativeElement) return;
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !this.statsAnimated) {
          this.statsAnimated = true;
          this.runStatsCountUp();
        }
      },
      { threshold: 0.3, rootMargin: '0px' }
    );
    this.intersectionObserver.observe(this.statsSectionRef.nativeElement);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  private runStatsCountUp(): void {
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeOutCubic(progress);

      this.stats.forEach((stat) => {
        stat.current = stat.target * eased;
      });
      this.cdr.detectChanges();

      if (progress < 1) {
        this.statsAnimationFrameId = requestAnimationFrame(tick);
      } else {
        this.stats.forEach((s) => (s.current = s.target));
        this.cdr.detectChanges();
      }
    };

    this.statsAnimationFrameId = requestAnimationFrame(tick);
  }

  ngOnDestroy(): void {
    this.threeService.dispose();
    if (this.statsAnimationFrameId != null) {
      cancelAnimationFrame(this.statsAnimationFrameId);
    }
    this.intersectionObserver?.disconnect();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showBackToTop = window.scrollY > 400;
  }

  scrollTo(id: string): void {
    this.mobileMenuOpen = false;
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleFaq(index: number): void {
    this.faqOpen = this.faqOpen === index ? null : index;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  onNewsletterSubmit(e?: Event): void {
    e?.preventDefault();
    if (this.newsletterEmail) {
      console.log('Newsletter signup:', this.newsletterEmail);
      this.newsletterEmail = '';
    }
  }
}
