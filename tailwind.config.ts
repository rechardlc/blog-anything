import type { Config } from 'tailwindcss';

import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // SnowUI inspired color palette - 更现代的配色
        snow: {
          50: '#fafcfe',
          100: '#f1f7fd',
          200: '#e2eef9',
          300: '#c8dff3',
          400: '#a7cceb',
          500: '#7db3e0',
          600: '#5a98d3',
          700: '#4380c1',
          800: '#386aa0',
          900: '#305681',
          950: '#1f3a56',
        },
        // 新增现代紫蓝色调
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // 优化的灰色调
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // 自定义品牌主题色 - 更现代的蓝色调
        brand: {
          50: 'hsl(var(--brand-50))',
          100: 'hsl(var(--brand-100))',
          200: 'hsl(var(--brand-200))',
          300: 'hsl(var(--brand-300))',
          400: 'hsl(var(--brand-400))',
          500: 'hsl(var(--brand-500))', // 主色
          600: 'hsl(var(--brand-600))',
          700: 'hsl(var(--brand-700))',
          800: 'hsl(var(--brand-800))',
          900: 'hsl(var(--brand-900))',
          950: 'hsl(var(--brand-950))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'Consolas',
          '"Liberation Mono"',
          'Menlo',
          'Courier',
          'monospace',
        ],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'brand-sm': '0 1px 2px 0 hsl(var(--brand-500) / 0.1)',
        'brand-md':
          '0 4px 6px -1px hsl(var(--brand-500) / 0.15), 0 2px 4px -2px hsl(var(--brand-500) / 0.1)',
        'brand-lg':
          '0 10px 15px -3px hsl(var(--brand-500) / 0.2), 0 4px 6px -4px hsl(var(--brand-500) / 0.1)',
        'brand-xl':
          '0 20px 25px -5px hsl(var(--brand-500) / 0.25), 0 8px 10px -6px hsl(var(--brand-500) / 0.1)',
        'primary-sm': '0 1px 2px 0 hsl(var(--primary) / 0.1)',
        'primary-md':
          '0 4px 6px -1px hsl(var(--primary) / 0.15), 0 2px 4px -2px hsl(var(--primary) / 0.1)',
        'primary-lg':
          '0 10px 15px -3px hsl(var(--primary) / 0.2), 0 4px 6px -4px hsl(var(--primary) / 0.1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'spin-accelerate': {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(10deg)' },
          '20%': { transform: 'rotate(40deg)' },
          '30%': { transform: 'rotate(60deg)' },
          '40%': { transform: 'rotate(120deg)' },
          '50%': { transform: 'rotate(240deg)' },
          '60%': { transform: 'rotate(480deg)' },
          '70%': { transform: 'rotate(960deg)' },
          '80%': { transform: 'rotate(1920deg)' },
          '90%': { transform: 'rotate(3840deg)' },
          '100%': { transform: 'rotate(7680deg)' },
        },
        'spin-constant': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(2px)' },
          '100%': { transform: 'translateX(20px)' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(20px)' },
          '50%': { transform: 'translateX(18px)' },
          '100%': { transform: 'translateX(0)' },
        },
        'theme-fade-in': {
          '0%': { opacity: '0.7' },
          '100%': { opacity: '1' },
        },
        'theme-scale': {
          '0%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-accelerate':
          'spin-accelerate 3s cubic-bezier(.34,0,.84,1) 1s forwards, spin-constant 0.1s linear 3.5s infinite',
        'spin-constant': 'spin-constant 0.5s linear infinite',
        'spin-constant-slow': 'spin-constant 4s linear infinite',
        'slide-right': 'slide-right 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-left': 'slide-left 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'theme-transition':
          'theme-fade-in 0.3s ease-out, theme-scale 0.3s ease-out',
        'theme-fade': 'theme-fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
